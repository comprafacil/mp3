export const defaultLocale = 'es';
export const locales = ['es', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const translations = {
  es: {
    site: {
      name: 'mp3',
      tagline: 'Tu guía definitiva para el mundo de la música',
      description: 'Reviews de instrumentos, tutoriales de producción, cursos de música y herramientas gratuitas para músicos.'
    },
    nav: {
      home: 'Inicio',
      reviews: 'Reviews',
      tutorials: 'Tutoriales',
      courses: 'Cursos',
      gear: 'Equipos',
      streaming: 'Streaming'
    },
    home: {
      title: 'Tu guía definitiva para el mundo de la música',
      subtitle: 'Descubre los mejores instrumentos, tutoriales y cursos de música',
      cta: 'Explorar Reviews'
    },
    article: {
      readTime: 'min de lectura',
      lastUpdated: 'Última actualización',
      publishedOn: 'Publicado el',
      share: 'Compartir',
      related: 'Artículos relacionados',
      wasHelpful: '¿Te fue útil este artículo?',
      yes: 'Sí',
      no: 'No'
    },
    search: {
      placeholder: 'Buscar artículos, reviews, tutoriales...',
      noResults: 'No se encontraron resultados',
      searching: 'Buscando...'
    },
    newsletter: {
      title: 'Recibe las mejores guías cada semana',
      description: 'Únete a miles de músicos que reciben contenido exclusivo',
      placeholder: 'Tu email',
      subscribe: 'Suscribirse',
      success: '¡Gracias por suscribirte! Revisa tu email para confirmar.',
      error: 'Error al suscribirte. Intenta de nuevo.'
    },
    footer: {
      about: 'Sobre mp3',
      contact: 'Contacto',
      privacy: 'Política de privacidad',
      terms: 'Términos y condiciones',
      cookies: 'Política de cookies',
      copyright: '© 2025 mp3. Todos los derechos reservados.'
    }
  },
  en: {
    site: {
      name: 'mp3',
      tagline: 'Your ultimate guide to the world of music',
      description: 'Instrument reviews, production tutorials, music courses and free tools for musicians.'
    },
    nav: {
      home: 'Home',
      reviews: 'Reviews',
      tutorials: 'Tutorials',
      courses: 'Courses',
      gear: 'Gear',
      streaming: 'Streaming'
    },
    home: {
      title: 'Your Ultimate Guide to Music',
      subtitle: 'Discover the best instruments, tutorials and music courses',
      cta: 'Explore Reviews'
    },
    article: {
      readTime: 'min read',
      lastUpdated: 'Last updated',
      publishedOn: 'Published on',
      share: 'Share',
      related: 'Related articles',
      wasHelpful: 'Was this article helpful?',
      yes: 'Yes',
      no: 'No'
    },
    search: {
      placeholder: 'Search articles, reviews, tutorials...',
      noResults: 'No results found',
      searching: 'Searching...'
    },
    newsletter: {
      title: 'Get the best guides every week',
      description: 'Join thousands of musicians receiving exclusive content',
      placeholder: 'Your email',
      subscribe: 'Subscribe',
      success: 'Thanks for subscribing! Check your email to confirm.',
      error: 'Error subscribing. Please try again.'
    },
    footer: {
      about: 'About mp3',
      contact: 'Contact',
      privacy: 'Privacy policy',
      terms: 'Terms and conditions',
      cookies: 'Cookie policy',
      copyright: '© 2025 mp3. All rights reserved.'
    }
  },
  pt: {
    site: {
      name: 'mp3',
      tagline: 'Seu guia definitivo para o mundo da música',
      description: 'Reviews de instrumentos, tutoriais de produção, cursos de música e ferramentas gratuitas para músicos.'
    },
    nav: {
      home: 'Início',
      reviews: 'Reviews',
      tutorials: 'Tutoriais',
      courses: 'Cursos',
      gear: 'Equipamentos',
      streaming: 'Streaming'
    },
    home: {
      title: 'Seu Guia Definitivo para Música',
      subtitle: 'Descubra os melhores instrumentos, tutoriais e cursos de música',
      cta: 'Explorar Reviews'
    },
    article: {
      readTime: 'min de leitura',
      lastUpdated: 'Última atualização',
      publishedOn: 'Publicado em',
      share: 'Compartilhar',
      related: 'Artigos relacionados',
      wasHelpful: 'Este artigo foi útil?',
      yes: 'Sim',
      no: 'Não'
    },
    search: {
      placeholder: 'Buscar artigos, reviews, tutoriais...',
      noResults: 'Nenhum resultado encontrado',
      searching: 'Buscando...'
    },
    newsletter: {
      title: 'Receba os melhores guias toda semana',
      description: 'Junte-se a milhares de músicos recebendo conteúdo exclusivo',
      placeholder: 'Seu email',
      subscribe: 'Inscrever-se',
      success: 'Obrigado por se inscrever! Verifique seu email para confirmar.',
      error: 'Erro ao se inscrever. Tente novamente.'
    },
    footer: {
      about: 'Sobre mp3',
      contact: 'Contato',
      privacy: 'Política de privacidade',
      terms: 'Termos e condições',
      cookies: 'Política de cookies',
      copyright: '© 2025 mp3. Todos os direitos reservados.'
    }
  }
};

export function getLangFromRequest(request: Request): Locale {
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang) return defaultLocale;

  const browserLangs = acceptLang
    .split(',')
    .map(lang => {
      const [code, priority] = lang.trim().split(';q=');
      return {
        code: code.toUpperCase(),
        priority: priority ? parseFloat(priority) : 1
      };
    })
    .sort((a, b) => b.priority - a.priority);

  const ptLocales = ['PT', 'BR'];
  const esLocales = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'DO', 'HN', 'SV', 'NI', 'CR', 'PA', 'PY', 'UY', 'BO', 'GQ', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'];

  for (const { code } of browserLangs) {
    const shortCode = code.split('-')[0];

    if (ptLocales.includes(code) || shortCode === 'PT' || shortCode === 'BR') {
      return 'pt';
    }

    if (esLocales.includes(code)) {
      return 'es';
    }

    if (['419', 'ES'].some(loc => code.startsWith(loc))) {
      return 'es';
    }
  }

  return 'en';
}
