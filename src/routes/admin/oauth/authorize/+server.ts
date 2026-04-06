import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const SCOPE = 'openid email profile';

export const GET: RequestHandler = async ({ url, locals }) => {
  const clientId = locals.env?.GOOGLE_CLIENT_ID || '';
  const redirectUri = locals.env?.GOOGLE_REDIRECT_URI || 'https://mp3-musica.com/admin/oauth/callback';
  
  if (!clientId) {
    return new Response('Google OAuth no configurado', { status: 500 });
  }

  const state = crypto.randomUUID();
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPE);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  if (locals.env?.KV) {
    await locals.env.KV.put(`oauth_state:${state}`, state, { expirationTtl: 600 });
  }

  throw redirect(302, authUrl.toString());
};
