import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';
import { generateOrganizationSchema, generateWebSiteSchema } from '$lib/seo/schemas';

export const load: PageServerLoad = async ({ params, locals }) => {
  const lang = params.lang as Locale;
  const t = translations[lang];

  let silos = [
    { slug: 'reviews', name_es: 'Reviews', name_en: 'Reviews', name_pt: 'Reviews' },
    { slug: 'tutorials', name_es: 'Tutoriales', name_en: 'Tutorials', name_pt: 'Tutoriais' },
    { slug: 'courses', name_es: 'Cursos', name_en: 'Courses', name_pt: 'Cursos' },
    { slug: 'gear', name_es: 'Equipos', name_en: 'Gear', name_pt: 'Equipamentos' },
    { slug: 'streaming', name_es: 'Streaming', name_en: 'Streaming', name_pt: 'Streaming' }
  ];

  let latestArticles: any[] = [];

  // Try to fetch from D1 if available
  try {
    if (locals.env?.DB) {
      const { results } = await locals.env.DB.prepare(`
        SELECT * FROM articles 
        WHERE status = 'published' AND lang = ?
        ORDER BY published_at DESC 
        LIMIT 6
      `).bind(lang).all();
      latestArticles = results || [];
    }
  } catch (e) {
    // D1 not available yet, use empty array
    console.log('D1 not available:', e);
  }

  const meta = {
    title: t.site.name + ' - ' + t.site.tagline,
    description: t.site.description
  };

  const schemas = {
    organization: generateOrganizationSchema(),
    website: generateWebSiteSchema()
  };

  return {
    lang,
    t,
    silos,
    latestArticles,
    meta,
    schemas
  };
};
