import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const lang = params.lang as Locale;
  const query = url.searchParams.get('q') || '';
  const t = translations[lang];
  
  let results: any[] = [];
  
  if (query && query.length >= 2) {
    try {
      if (locals.env?.DB) {
        const { results: searchResults } = await locals.env.DB.prepare(`
          SELECT title, slug, silo_slug, excerpt, read_time
          FROM articles 
          WHERE status = 'published' AND lang = ? AND (title LIKE ? OR content LIKE ?)
          ORDER BY published_at DESC
          LIMIT 20
        `).bind(lang, `%${query}%`, `%${query}%`).all();
        
        results = searchResults || [];
      }
    } catch (e) {
      console.log('Search error:', e);
    }
  }
  
  return {
    lang,
    t,
    query,
    results,
    meta: {
      title: `${query} | Buscar | mp3-musica.com`,
      description: `Resultados de búsqueda para "${query}" en mp3-musica.com`
    }
  };
};
