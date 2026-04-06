import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';
import { generateArticleSchema, generateBreadcrumbSchema } from '$lib/seo/schemas';

export const load: PageServerLoad = async ({ params, locals }) => {
  const lang = params.lang as Locale;
  const slug = params.slug;
  const t = translations[lang];

  let article: any = null;
  let relatedArticles: any[] = [];

  // Try to fetch from D1 if available
  try {
    if (locals.env?.DB) {
      // Get article
      const { results } = await locals.env.DB.prepare(`
        SELECT * FROM articles 
        WHERE status = 'published' AND slug = ? AND lang = ? AND silo_slug = 'reviews'
      `).bind(slug, lang).all();
      
      article = results?.[0];

      // Get related articles (same silo, different slug)
      if (article) {
        const related = await locals.env.DB.prepare(`
          SELECT * FROM articles 
          WHERE status = 'published' AND lang = ? AND silo_slug = 'reviews' AND slug != ?
          ORDER BY published_at DESC 
          LIMIT 4
        `).bind(lang, slug).all();
        relatedArticles = related.results || [];
      }
    }
  } catch (e) {
    console.log('D1 not available:', e);
  }

  if (!article) {
    throw new Response('Not Found', { status: 404 });
  }

  const schemas = {
    article: generateArticleSchema(
      article.title,
      article.meta_description || article.excerpt,
      `/${lang}/reviews/${article.slug}`,
      article.og_image || article.featured_image || '',
      article.published_at,
      article.last_modified || article.published_at,
      article.author_name,
      lang
    ),
    breadcrumb: generateBreadcrumbSchema([
      { name: t.nav.home, url: `/${lang}/` },
      { name: t.nav.reviews, url: `/${lang}/reviews` },
      { name: article.title, url: `/${lang}/reviews/${article.slug}` }
    ], lang)
  };

  return {
    lang,
    t,
    article,
    relatedArticles,
    schemas
  };
};
