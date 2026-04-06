import type { RequestHandler } from './$types';
import { locales } from '$lib/i18n';

export const GET: RequestHandler = async ({ url, locals }) => {
  const baseUrl = 'https://www.mp3-musica.com';
  
  let articles: { slug: string; lang: string; silo_slug: string; last_modified: string }[] = [];
  let silos: { slug: string }[] = [];

  // Static pages
  const staticPages = [
    { slug: '', changefreq: 'daily', priority: '1.0' },
    { slug: 'reviews', changefreq: 'weekly', priority: '0.9' },
    { slug: 'tutorials', changefreq: 'weekly', priority: '0.9' },
    { slug: 'courses', changefreq: 'weekly', priority: '0.9' },
    { slug: 'gear', changefreq: 'weekly', priority: '0.9' },
    { slug: 'streaming', changefreq: 'weekly', priority: '0.9' },
    { slug: 'privacy', changefreq: 'monthly', priority: '0.3' },
    { slug: 'terms', changefreq: 'monthly', priority: '0.3' },
    { slug: 'cookies', changefreq: 'monthly', priority: '0.3' }
  ];

  // Try to fetch dynamic content from D1
  try {
    if (locals.env?.DB) {
      const articlesResult = await locals.env.DB.prepare(`
        SELECT slug, lang, silo_slug, last_modified FROM articles WHERE status = 'published'
      `).all();
      articles = articlesResult.results || [];

      const silosResult = await locals.env.DB.prepare(`SELECT slug FROM silos`).all();
      silos = silosResult.results || [];
    }
  } catch (e) {
    console.log('D1 not available for sitemap');
  }

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Add static pages for each language
  for (const lang of locales) {
    for (const page of staticPages) {
      const loc = `${baseUrl}/${lang}/${page.slug}`;
      sitemap += `
  <url>
    <loc>${loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/${page.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/${page.slug}"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/${page.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/es/${page.slug}"/>
  </url>`;
    }
  }

  // Add articles
  for (const article of articles) {
    const loc = `${baseUrl}/${article.lang}/${article.silo_slug}/${article.slug}`;
    const lastmod = article.last_modified || new Date().toISOString().split('T')[0];
    sitemap += `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/${article.silo_slug}/${article.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/${article.silo_slug}/${article.slug}"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/${article.silo_slug}/${article.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/es/${article.silo_slug}/${article.slug}"/>
  </url>`;
  }

  sitemap += `
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
