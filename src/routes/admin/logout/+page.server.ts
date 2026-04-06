import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { hashToken } from '$lib/auth/session';

export const load: PageServerLoad = async () => {
  throw redirect(302, '/admin/login');
};

export const actions: Actions = {
  default: async ({ cookies, locals }) => {
    const sessionToken = cookies.get('admin_session');
    
    if (sessionToken && locals.env?.DB) {
      const tokenHash = hashToken(sessionToken);
      await locals.env.DB.prepare(`
        DELETE FROM admin_sessions WHERE token_hash = ?
      `).bind(tokenHash).run();
    }

    cookies.delete('admin_session', { path: '/' });
    
    throw redirect(302, '/admin/login');
  }
};
