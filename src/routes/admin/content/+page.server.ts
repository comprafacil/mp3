import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const status = url.searchParams.get('status') || '';
  const lang = url.searchParams.get('lang') || '';
  const limit = 20;
  const offset = (page - 1) * limit;

  let content: any[] = [];
  let total = 0;
  let categories: any[] = [];

  try {
    if (locals.env?.DB) {
      let whereClause = '1=1';
      const params: any[] = [];

      if (status) {
        whereClause += ' AND status = ?';
        params.push(status);
      }
      if (lang) {
        whereClause += ' AND lang = ?';
        params.push(lang);
      }

      const countResult = await locals.env.DB.prepare(`
        SELECT COUNT(*) as total FROM content WHERE ${whereClause}
      `).bind(...params).first() as any;
      total = countResult?.total || 0;

      const contentResult = await locals.env.DB.prepare(`
        SELECT id, title, slug, type, status, lang, author_name, published_at, created_at
        FROM content 
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all();
      content = contentResult.results || [];

      const catResult = await locals.env.DB.prepare(`
        SELECT id, slug, name_es, name_en, name_pt, type FROM categories ORDER BY type, name_es
      `).all();
      categories = catResult.results || [];
    }
  } catch (e) {
    console.error('Content load error:', e);
  }

  return {
    content,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    filters: { status, lang },
    categories,
    meta: {
      title: 'Gestionar Contenido | Admin',
      description: 'Administrar contenido del sitio'
    }
  };
};
