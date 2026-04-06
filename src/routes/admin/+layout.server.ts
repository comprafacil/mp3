import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, locals, url }) => {
  const sessionToken = cookies.get('admin_session');
  const currentPath = url.pathname;
  
  if (currentPath === '/admin/login') {
    return {};
  }

  if (!sessionToken) {
    throw redirect(302, '/admin/login');
  }

  try {
    if (!locals.env?.DB) {
      throw redirect(302, '/admin/login');
    }

    const { hashToken } = await import('$lib/auth/session');
    const tokenHash = await hashToken(sessionToken);
    
    const session = await locals.env.DB.prepare(`
      SELECT s.*, u.email, u.role, u.is_active
      FROM admin_sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.is_active = 1
    `).bind(tokenHash).first() as any;

    if (!session) {
      cookies.delete('admin_session', { path: '/' });
      throw redirect(302, '/admin/login');
    }

    return {
      user: {
        id: session.user_id,
        email: session.email,
        role: session.role
      }
    };
  } catch (error) {
    if (error instanceof Response) throw error;
    cookies.delete('admin_session', { path: '/' });
    throw redirect(302, '/admin/login');
  }
};
