import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const days = parseInt(url.searchParams.get('days') || '28');
  const lang = url.searchParams.get('lang') || '';

  let queries: any[] = [];
  let pages: any[] = [];
  let stats = { totalClicks: 0, totalImpressions: 0, avgCTR: 0, avgPosition: 0 };

  try {
    if (locals.env?.DB) {
      let langClause = lang ? 'AND lang = ?' : '';
      const params = lang ? [lang] : [];

      const statsResult = await locals.env.DB.prepare(`
        SELECT 
          SUM(clicks) as clicks,
          SUM(impressions) as impressions,
          AVG(ctr) as ctr,
          AVG(position) as position
        FROM gsc_query_insights 
        WHERE created_at >= date('now', '-${days} days') ${langClause}
      `).bind(...params).first() as any;
      stats = {
        totalClicks: statsResult?.clicks || 0,
        totalImpressions: statsResult?.impressions || 0,
        avgCTR: statsResult?.ctr || 0,
        avgPosition: statsResult?.position || 0
      };

      const queriesResult = await locals.env.DB.prepare(`
        SELECT query, lang, SUM(clicks) as clicks, SUM(impressions) as impressions, 
               AVG(ctr) as ctr, AVG(position) as position
        FROM gsc_query_insights 
        WHERE created_at >= date('now', '-${days} days') ${langClause}
        GROUP BY query, lang
        ORDER BY clicks DESC
        LIMIT 50
      `).bind(...params).all();
      queries = queriesResult.results || [];

      const pagesResult = await locals.env.DB.prepare(`
        SELECT page, lang, SUM(clicks) as clicks, SUM(impressions) as impressions,
               AVG(ctr) as ctr, AVG(position) as position
        FROM gsc_query_insights 
        WHERE created_at >= date('now', '-${days} days') ${langClause}
        GROUP BY page, lang
        ORDER BY clicks DESC
        LIMIT 20
      `).bind(...params).all();
      pages = pagesResult.results || [];
    }
  } catch (e) {
    console.error('GSC load error:', e);
  }

  return {
    queries,
    pages,
    stats,
    filters: { days, lang },
    meta: {
      title: 'Google Search Console | Admin',
      description: 'Análisis de Google Search Console'
    }
  };
};
