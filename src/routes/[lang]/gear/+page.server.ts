import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

export const load: PageServerLoad = async ({ params, locals }) => {
  const lang = params.lang as Locale;
  const siloSlug = 'gear';
  const t = translations[lang];

  let silo = { name_es: 'Equipos', name_en: 'Gear', name_pt: 'Equipamentos', description_es: 'Reviews y guías de equipos de estudio', description_en: 'Studio gear reviews and guides', description_pt: 'Reviews e guias de equipamentos de estúdio' };
  let articles: any[] = [];

  try {
    if (locals.env?.DB) {
      const { results } = await locals.env.DB.prepare(`
        SELECT title, slug, excerpt, read_time, published_at 
        FROM articles 
        WHERE status = 'published' AND lang = ? AND silo_slug = ?
        ORDER BY published_at DESC
      `).bind(lang, siloSlug).all();
      articles = results || [];
    }
  } catch (e) {
    console.log('D1 not available');
  }

  const meta = {
    title: t.nav.gear + ' | mp3',
    description: silo[`description_${lang}` as keyof typeof silo]
  };

  return { lang, t, silo, articles, meta };
};
