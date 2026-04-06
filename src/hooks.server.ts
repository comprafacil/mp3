import type { Handle } from '@sveltejs/kit';
import { locales, defaultLocale, type Locale } from '$lib/i18n';

function getLangFromPath(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  if (segment && locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return null;
}

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  
  try {
    const langFromPath = getLangFromPath(pathname);

    if (
      pathname.startsWith('/_') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.') ||
      pathname.startsWith('/api')
    ) {
      return resolve(event);
    }

    if (langFromPath) {
      event.cookies.set('preferred_lang', langFromPath, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax'
      });
      return resolve(event);
    }

    if (pathname === '/' || pathname === '') {
      const savedLang = event.cookies.get('preferred_lang');

      if (savedLang && locales.includes(savedLang as Locale)) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/${savedLang}/` }
        });
      }

      const acceptLanguage = event.request.headers.get('accept-language');
      let lang = defaultLocale;

      if (acceptLanguage) {
        const browserLangs = acceptLanguage
          .split(',')
          .map(l => {
            const [code, priority] = l.trim().split(';q=');
            return {
              code: code.toUpperCase(),
              priority: priority ? parseFloat(priority) : 1
            };
          })
          .sort((a, b) => b.priority - a.priority);

        const ptLocales = ['PT', 'BR'];
        const esLocales = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE'];

        for (const { code } of browserLangs) {
          const shortCode = code.split('-')[0];

          if (ptLocales.includes(code) || shortCode === 'PT' || shortCode === 'BR') {
            lang = 'pt';
            break;
          }

          if (esLocales.includes(code)) {
            lang = 'es';
            break;
          }
        }
      }

      return new Response(null, {
        status: 302,
        headers: { Location: `/${lang}/` }
      });
    }

    const savedLang = event.cookies.get('preferred_lang');
    if (savedLang && locales.includes(savedLang as Locale)) {
      event.params.lang = savedLang;
    } else {
      event.params.lang = defaultLocale;
    }

    return resolve(event);
  } catch (error) {
    console.error('Hook error:', error);
    return resolve(event);
  }
};
