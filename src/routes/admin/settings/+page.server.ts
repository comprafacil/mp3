import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  let settings: Record<string, string> = {};

  try {
    if (locals.env?.DB) {
      const results = await locals.env.DB.prepare(`
        SELECT setting_key, setting_value FROM site_settings
      `).all();
      
      for (const row of results.results || []) {
        const r = row as any;
        settings[r.setting_key] = r.setting_value || '';
      }
    }
  } catch (e) {
    console.error('Settings load error:', e);
  }

  return {
    settings,
    meta: {
      title: 'Configuración | Admin',
      description: 'Configuración del sitio'
    }
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const updates: Array<{key: string; value: string}> = [];

    const oauthGoogleEnabled = formData.get('oauth_google_enabled')?.toString();
    const oauthGoogleClientId = formData.get('oauth_google_client_id')?.toString() || '';
    const oauthGoogleClientSecret = formData.get('oauth_google_client_secret')?.toString() || '';
    const siteTitle = formData.get('site_title')?.toString() || '';
    const siteDescription = formData.get('site_description')?.toString() || '';
    const googleAnalyticsId = formData.get('google_analytics_id')?.toString() || '';
    const googleSiteVerification = formData.get('google_site_verification')?.toString() || '';

    updates.push(
      { key: 'oauth_google_enabled', value: oauthGoogleEnabled === 'on' ? 'true' : 'false' },
      { key: 'oauth_google_client_id', value: oauthGoogleClientId },
      { key: 'oauth_google_client_secret', value: oauthGoogleClientSecret },
      { key: 'site_title', value: siteTitle },
      { key: 'site_description', value: siteDescription },
      { key: 'google_analytics_id', value: googleAnalyticsId },
      { key: 'google_site_verification', value: googleSiteVerification }
    );

    try {
      if (!locals.env?.DB) {
        return fail(500, { error: 'Error de configuración' });
      }

      for (const update of updates) {
        await locals.env.DB.prepare(`
          INSERT INTO site_settings (setting_key, setting_value, updated_at)
          VALUES (?, ?, datetime('now'))
          ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = datetime('now')
        `).bind(update.key, update.value).run();
      }

      return { success: true };
    } catch (e) {
      console.error('Settings save error:', e);
      return fail(500, { error: 'Error al guardar configuración' });
    }
  }
};
