import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { verifyPassword } from '$lib/auth/session';
import { checkRateLimit } from '$lib/auth/rate-limit';

export const load: PageServerLoad = async ({ locals }) => {
  let oauthEnabled = false;
  let oauthConfigured = false;

  try {
    if (locals.env?.DB) {
      const oauthEnabledResult = await locals.env.DB.prepare(`
        SELECT setting_value FROM site_settings WHERE setting_key = 'oauth_google_enabled'
      `).first() as any;
      oauthEnabled = oauthEnabledResult?.setting_value === 'true';

      const oauthClientIdResult = await locals.env.DB.prepare(`
        SELECT setting_value FROM site_settings WHERE setting_key = 'oauth_google_client_id'
      `).first() as any;
      oauthConfigured = !!(oauthClientIdResult?.setting_value);
    }
  } catch (e) {
    console.error('Login settings load error:', e);
  }

  return {
    oauthEnabled,
    oauthConfigured,
    meta: {
      title: 'Login | Admin mp3-musica.com',
      description: 'Acceso al panel de administración'
    }
  };
};

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    if (!email || !password) {
      return fail(400, { error: 'Email y contraseña son requeridos', email });
    }

    const clientIp = request.headers.get('cf-connecting-ip') || 
                     request.headers.get('x-forwarded-for') || 
                     'unknown';
    
    const rateLimitCheck = await checkRateLimit(locals.env, clientIp, 'login');
    if (!rateLimitCheck.allowed) {
      return fail(429, { error: 'Demasiados intentos. Intenta más tarde.' });
    }

    try {
      if (!locals.env?.DB) {
        return fail(500, { error: 'Error de configuración', email });
      }

      const adminUser = await locals.env.DB.prepare(`
        SELECT id, email, password_hash, password_salt, role, is_active
        FROM admin_users WHERE email = ?
      `).first(email) as any;

      if (!adminUser) {
        return fail(401, { error: 'Credenciales inválidas', email });
      }

      if (!adminUser.is_active) {
        return fail(403, { error: 'Cuenta deshabilitada', email });
      }

      const isValid = await verifyPassword(password, adminUser.password_hash, adminUser.password_salt);
      
      if (!isValid) {
        return fail(401, { error: 'Credenciales inválidas', email });
      }

      const { generateSessionToken, createSessionData, serializeSession } = await import('$lib/auth/session');
      const token = generateSessionToken();
      const sessionData = createSessionData(adminUser.id, adminUser.email, adminUser.role);
      const serializedSession = serializeSession(sessionData);

      await locals.env.DB.prepare(`
        INSERT INTO admin_sessions (token_hash, user_id, expires_at)
        VALUES (?, ?, datetime('now', '+1 day'))
      `).bind(
        (await import('$lib/auth/session')).hashToken(token),
        adminUser.id
      ).run();

      cookies.set('admin_session', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 86400
      });

      throw redirect(302, '/admin');
    } catch (e: any) {
      if (e.status === 302) throw e;
      console.error('Login error:', e);
      return fail(500, { error: 'Error interno', email });
    }
  }
};
