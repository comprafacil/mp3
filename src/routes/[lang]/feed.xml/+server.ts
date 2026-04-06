import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const lang = params.lang || 'es';
  const baseUrl = 'https://www.mp3-musica.com';
  
  let articles: any[] = [];
  
  try {
    if (locals.env?.DB) {
      const result = await locals.env.DB.prepare(`
        SELECT title, slug, silo_slug, excerpt, published_at, last_modified
        FROM articles WHERE status = 'published' AND lang = ?
        ORDER BY published_at DESC LIMIT 50
      `).bind(lang).all();
      articles = result.results || [];
    }
  } catch (e) {
    console.log('RSS error:', e);
  }
  
  const titles: Record<string, string> = {
    es: 'mp3-musica.com - Últimos artículos',
    en: 'mp3-musica.com - Latest articles',
    pt: 'mp3-musica.com - Últimos artigos'
  };
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${titles[lang] || titles.es}</title>
    <link>${baseUrl}/${lang}/</link>
    <description>Reviews, tutoriales y cursos de música</description>
    <language>${lang}</language>
    <atom:link href="${baseUrl}/${lang}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/${lang}/${a.silo_slug}/${a.slug}</link>
      <description><![CDATA[${a.excerpt || ''}]]></description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <guid>${baseUrl}/${lang}/${a.silo_slug}/${a.slug}</guid>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
