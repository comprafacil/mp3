import type { PageServerLoad } from './$types';

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
