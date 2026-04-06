import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { generateSessionToken, hashToken } from '$lib/auth/session';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export const GET: RequestHandler = async ({ url, cookies, locals, getClientAddress }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    throw redirect(302, '/admin/login?error=oauth_denied');
  }

  if (!code || !state) {
    throw redirect(302, '/admin/login?error=invalid_callback');
  }

  try {
    if (!locals.env?.KV || !locals.env?.DB) {
      throw redirect(302, '/admin/login?error=server_error');
    }

    const savedState = await locals.env.KV.get(`oauth_state:${state}`);
    if (!savedState) {
      throw redirect(302, '/admin/login?error=invalid_state');
    }
    await locals.env.KV.delete(`oauth_state:${state}`);

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
      const randomSalt = crypto.randomUUID();
      const randomPasswordHash = crypto.createHash('sha512').update(googleId + randomSalt).digest('hex');
      
      const result = await locals.env.DB.prepare(`
        INSERT INTO admin_users (email, password_hash, salt, role, is_active, google_id, created_at)
        VALUES (?, ?, ?, 'editor', 1, ?, datetime('now'))
      `).bind(email, randomPasswordHash, randomSalt, googleId).run();

      user = { id: result.meta?.last_row_id, email, role: 'editor', is_active: 1 };
    }

    if (!user.is_active) {
      throw redirect(302, '/admin/login?error=account_disabled');
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();
    const clientIP = getClientAddress();

    await locals.env.DB.prepare(`
      INSERT INTO admin_sessions (user_id, token_hash, expires_at, ip_address, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(user.id, hashToken(sessionToken), expiresAt, clientIP).run();

    await locals.env.DB.prepare(`
      UPDATE admin_users SET last_login_at = datetime('now') WHERE id = ?
    `).bind(user.id).run();

    cookies.set('admin_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400
    });

    throw redirect(302, '/admin');
  } catch (err) {
    if (err instanceof Response) throw err;
    console.error('OAuth callback error:', err);
    throw redirect(302, '/admin/login?error=oauth_failed');
  }
};
