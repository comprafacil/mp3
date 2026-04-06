import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

export const load: PageServerLoad = async ({ params, locals }) => {
  const lang = params.lang as Locale;
  const t = translations[lang];
  
  let stats = { totalArticles: 0, publishedArticles: 0, totalSubscribers: 0, totalSilos: 0 };
  let recentArticles: any[] = [];
  
  try {
    if (locals.env?.DB) {
      const articlesResult = await locals.env.DB.prepare(`
        SELECT COUNT(*) as total, 
               SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published
        FROM articles
      `).first() as any;
      stats.totalArticles = articlesResult?.total || 0;
      stats.publishedArticles = articlesResult?.published || 0;
      
      const subscribersResult = await locals.env.DB.prepare(`SELECT COUNT(*) as total FROM subscribers`).first() as any;
      stats.totalSubscribers = subscribersResult?.total || 0;
      
      const silosResult = await locals.env.DB.prepare(`SELECT COUNT(*) as total FROM silos`).first() as any;
      stats.totalSilos = silosResult?.total || 0;
      
      const recentResult = await locals.env.DB.prepare(`
        SELECT id, title, slug, silo_slug, status, published_at
        FROM articles ORDER BY created_at DESC LIMIT 10
      `).all();
      recentArticles = recentResult.results || [];
    }
  } catch (e) {
    console.log('Admin load error:', e);
  }
  
  return {
    lang,
    t,
    stats,
    recentArticles,
    meta: {
      title: 'Admin Dashboard | mp3-musica.com',
      description: 'Panel de administración de mp3-musica.com'
    }
  };
};
