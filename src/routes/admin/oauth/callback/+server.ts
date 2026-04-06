import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export const GET: RequestHandler = async ({ url, cookies, locals, getClientAddress }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    // OAuth was canceled by user or failed; redirect to login without OAuth error to avoid confusion
    throw redirect(302, '/admin/login');
  }

  if (!code || !state) {
    throw redirect(302, '/admin/login?error=invalid_callback');
  }

  try {
    if (!locals.env?.DB) {
      throw redirect(302, '/admin/login?error=server_error');
    }

    let kv: any = null;
    try {
      kv = locals.env.KV || locals.env.SESSION;
    } catch {
      kv = null;
    }

    if (kv) {
      const savedState = await kv.get(`oauth_state:${state}`);
      if (!savedState) {
        throw redirect(302, '/admin/login?error=invalid_state');
      }
      await kv.delete(`oauth_state:${state}`);
    }

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: locals.env.GOOGLE_CLIENT_ID || '',
        client_secret: locals.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: locals.env.GOOGLE_REDIRECT_URI || 'https://mp3-musica.com/admin/oauth/callback'
      })
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      throw redirect(302, '/admin/login?error=token_failed');
    }

    const tokens = await tokenResponse.json() as any;
    const accessToken = tokens.access_token;

    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userInfoResponse.ok) {
      throw redirect(302, '/admin/login?error=userinfo_failed');
    }

    const userInfo = await userInfoResponse.json() as any;
    const email = userInfo.email.toLowerCase();
    const googleId = userInfo.id;

    let user = await locals.env.DB.prepare(`
      SELECT id, email, role, is_active FROM admin_users 
      WHERE email = ? AND is_active = 1
    `).bind(email).first() as any;

    if (!user) {
      const { hashPassword } = await import('$lib/auth/session');
      const { hash } = await hashPassword(googleId + crypto.randomUUID());
      
      const result = await locals.env.DB.prepare(`
        INSERT INTO admin_users (email, password_hash, salt, role, is_active, google_id, created_at)
        VALUES (?, ?, ?, 'editor', 1, ?, datetime('now'))
      `).bind(email, hash, '', googleId).run();

      user = { id: result.meta?.last_row_id, email, role: 'editor', is_active: 1 };
    }

    if (!user.is_active) {
      throw redirect(302, '/admin/login?error=account_disabled');
    }

    const { generateSessionToken, hashToken, createSessionData, serializeSession } = await import('$lib/auth/session');
    const sessionToken = generateSessionToken();
    const sessionData = createSessionData(user.id, user.email, user.role);
    const serializedSession = serializeSession(sessionData);
    const tokenHash = await hashToken(sessionToken);

    await locals.env.DB.prepare(`
      INSERT INTO admin_sessions (token_hash, user_id, expires_at)
      VALUES (?, ?, datetime('now', '+1 day'))
    `).bind(tokenHash, user.id).run();

    await locals.env.DB.prepare(`
      UPDATE admin_users SET last_login_at = datetime('now') WHERE id = ?
    `).bind(user.id).run();

    cookies.set('admin_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 86400
    });

    throw redirect(302, '/admin');
  } catch (err) {
    if (err instanceof Response) throw err;
    console.error('OAuth callback error:', err);
    throw redirect(302, '/admin/login?error=oauth_failed');
  }
};
