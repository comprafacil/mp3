import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const lang = url.searchParams.get('lang') || 'es';
  const status = url.searchParams.get('status') || '';

  let opportunities: any[] = [];
  let pendingCount = 0;
  let inProgressCount = 0;

  try {
    if (locals.env?.DB) {
      let whereClause = '1=1';
      const params: any[] = [];

      if (lang) {
        whereClause += ' AND lang = ?';
        params.push(lang);
      }
      if (status) {
        whereClause += ' AND status = ?';
        params.push(status);
      }

      const countResult = await locals.env.DB.prepare(`
        SELECT status, COUNT(*) as count 
        FROM topic_opportunities 
        GROUP BY status
      `).all() as any[];
      
      for (const row of countResult || []) {
        if (row.status === 'identified') pendingCount += row.count;
        if (row.status === 'researching' || row.status === 'drafting') inProgressCount += row.count;
      }

      const oppResult = await locals.env.DB.prepare(`
        SELECT id, topic, source, reason, priority, commercial_intent, 
               seasonal_relevance, musician_profile, status, lang, created_at
        FROM topic_opportunities 
        WHERE ${whereClause}
        ORDER BY priority DESC, commercial_intent DESC
        LIMIT 50
      `).bind(...params).all();
      opportunities = oppResult.results || [];
    }
  } catch (e) {
    console.error('AI opportunities load error:', e);
  }

  return {
    opportunities,
    pendingCount,
    inProgressCount,
    filters: { lang, status },
    meta: {
      title: 'IA Editorial | Admin',
      description: 'Sistema de generación de contenido con IA'
    }
  };
};
