import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const days = parseInt(url.searchParams.get('days') || '7');
  const lang = url.searchParams.get('lang') || '';
  const zeroResults = url.searchParams.get('zero') === 'true';

  let searches: any[] = [];
  let stats = { total: 0, zeroResults: 0, uniqueQueries: 0 };

  try {
    if (locals.env?.DB) {
      let whereClause = `created_at >= date('now', '-${days} days')`;
      const params: any[] = [];

      if (lang) {
        whereClause += ' AND lang = ?';
        params.push(lang);
      }

      if (zeroResults) {
        whereClause += ' AND zero_results = 1';
      }

      const statsResult = await locals.env.DB.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN zero_results = 1 THEN 1 ELSE 0 END) as zero_results,
          COUNT(DISTINCT normalized_query) as unique_queries
        FROM search_logs 
        WHERE ${whereClause}
      `).bind(...params).first() as any;
      stats = {
        total: statsResult?.total || 0,
        zeroResults: statsResult?.zero_results || 0,
        uniqueQueries: statsResult?.unique_queries || 0
      };

      const searchesResult = await locals.env.DB.prepare(`
        SELECT 
          normalized_query,
          lang,
          COUNT(*) as count,
          MAX(results_count) as last_results,
          MIN(created_at) as first_search,
          MAX(created_at) as last_search
        FROM search_logs 
        WHERE ${whereClause}
        GROUP BY normalized_query, lang
        ORDER BY count DESC
        LIMIT 50
      `).bind(...params).all();
      searches = searchesResult.results || [];
    }
  } catch (e) {
    console.error('Search insights load error:', e);
  }

  return {
    searches,
    stats,
    filters: { days, lang, zeroResults },
    meta: {
      title: 'Análisis de Búsquedas | Admin',
      description: 'Análisis de búsquedas del sitio'
    }
  };
};
