import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  let stats = {
    totalContent: 0,
    publishedContent: 0,
    totalSubscribers: 0,
    totalCategories: 0,
    searchQueriesToday: 0,
    zeroResultSearches: 0
  };
  
  let recentContent: any[] = [];
  let topSearches: any[] = [];
  let opportunities: any[] = [];

  try {
    if (locals.env?.DB) {
      const contentResult = await locals.env.DB.prepare(`
        SELECT COUNT(*) as total, 
               SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published
        FROM content
      `).first() as any;
      stats.totalContent = contentResult?.total || 0;
      stats.publishedContent = contentResult?.published || 0;

      const subscribersResult = await locals.env.DB.prepare(`SELECT COUNT(*) as total FROM subscribers`).first() as any;
      stats.totalSubscribers = subscribersResult?.total || 0;

      const categoriesResult = await locals.env.DB.prepare(`SELECT COUNT(*) as total FROM categories WHERE type = 'silo'`).first() as any;
      stats.totalCategories = categoriesResult?.total || 0;

      const searchTodayResult = await locals.env.DB.prepare(`
        SELECT COUNT(*) as total FROM search_logs 
        WHERE created_at >= date('now', '-1 day')
      `).first() as any;
      stats.searchQueriesToday = searchTodayResult?.total || 0;

      const zeroResultResult = await locals.env.DB.prepare(`
        SELECT COUNT(*) as total FROM search_logs 
        WHERE zero_results = 1 AND created_at >= date('now', '-7 days')
      `).first() as any;
      stats.zeroResultSearches = zeroResultResult?.total || 0;

      const recentResult = await locals.env.DB.prepare(`
        SELECT id, title, type, status, lang, published_at, created_at
        FROM content ORDER BY created_at DESC LIMIT 10
      `).all();
      recentContent = recentResult.results || [];

      const topSearchResult = await locals.env.DB.prepare(`
        SELECT normalized_query, COUNT(*) as count, MAX(results_count) as last_results
        FROM search_logs 
        WHERE created_at >= date('now', '-7 days')
        GROUP BY normalized_query
        ORDER BY count DESC
        LIMIT 10
      `).all();
      topSearches = topSearchResult.results || [];

      const oppResult = await locals.env.DB.prepare(`
        SELECT id, topic, source, priority, commercial_intent, status, lang
        FROM topic_opportunities 
        WHERE status IN ('identified', 'researching', 'drafting')
        ORDER BY priority DESC, commercial_intent DESC
        LIMIT 10
      `).all();
      opportunities = oppResult.results || [];
    }
  } catch (e) {
    console.log('Admin dashboard load error:', e);
  }

  return {
    stats,
    recentContent,
    topSearches,
    opportunities,
    meta: {
      title: 'Admin Dashboard | mp3-musica.com',
      description: 'Panel de administración'
    }
  };
};
