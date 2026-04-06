import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { analyzeOpportunity } from '$lib/ai/content';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    meta: {
      title: 'Generar Contenido con IA | Admin',
      description: 'Generar contenido editorial asistido por IA'
    }
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const topic = formData.get('topic')?.toString() || '';
    const lang = formData.get('lang')?.toString() || 'es';
    const type = formData.get('type')?.toString() || 'article';
    const intent = formData.get('intent')?.toString() || 'informational';
    const musicianProfile = formData.get('musicianProfile')?.toString() || '';
    const commercialIntent = parseInt(formData.get('commercialIntent')?.toString() || '0', 10);
    const seasonalRelevance = formData.get('seasonalRelevance')?.toString() || '';

    if (!topic) {
      return fail(400, { error: 'El tema es requerido', topic });
    }

    try {
      const content = await analyzeOpportunity(locals.env, {
        topic,
        lang: lang as any,
        type: type as any,
        intent,
        musicianProfile,
        commercialIntent,
        seasonalRelevance
      });

      if (!locals.env?.DB) {
        return fail(500, { error: 'DB no disponible' });
      }

      await locals.env.DB.prepare(`
        INSERT INTO content (lang, type, title, slug, excerpt, body, status, seo_title, seo_description, published_at)
        VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, datetime('now'))
      `).bind(
        lang,
        type,
        content.title,
        content.slug,
        content.excerpt,
        content.body,
        content.seoTitle,
        content.metaDescription
      ).run();

      return {
        success: true,
        content,
        message: 'Contenido generado exitosamente'
      };
    } catch (e: any) {
      console.error('AI generation error:', e);
      return fail(500, { error: e.message || 'Error al generar contenido' });
    }
  }
};