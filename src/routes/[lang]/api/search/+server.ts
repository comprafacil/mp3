import type { RequestHandler } from './$types';

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

export const GET: RequestHandler = async ({ url, locals }) => {
  const query = url.searchParams.get('q') || '';
  const lang = url.searchParams.get('lang') || 'es';
  
  if (!query || query.length < 2) {
    return Response.json({ results: [] });
  }
  
  let results: any[] = [];
  
  try {
    if (locals.env?.DB) {
      const { results: searchResults } = await locals.env.DB.prepare(`
        SELECT title, slug, silo_slug, excerpt, read_time, lang
        FROM articles 
        WHERE status = 'published' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)
        ORDER BY published_at DESC
        LIMIT 10
      `).bind(`%${query}%`, `%${query}%`, `%${query}%`).all();
      
      results = searchResults || [];
      const resultsCount = results.length;
      const zeroResults = resultsCount === 0 ? 1 : 0;

      await locals.env.DB.prepare(`
        INSERT INTO search_logs (lang, query, normalized_query, results_count, zero_results)
        VALUES (?, ?, ?, ?, ?)
      `).bind(lang, query, normalizeQuery(query), resultsCount, zeroResults).run();
    }
  } catch (e) {
    console.log('Search API error:', e);
  }
  
  return Response.json({ results });
};
