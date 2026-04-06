import type { Locale } from '$lib/i18n';

export interface ContentRequest {
  topic: string;
  lang: Locale;
  type: 'article' | 'review' | 'tutorial' | 'course' | 'guide' | 'faq';
  intent: string;
  musicianProfile?: string;
  seasonalRelevance?: string;
  commercialIntent?: number;
  sourceData?: {
    searchInsights?: string[];
    gscQueries?: string[];
    existingContent?: string[];
  };
}

export interface ContentResponse {
  title: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  excerpt: string;
  body: string;
  outline: string[];
  faqs: Array<{ question: string; answer: string }>;
  internalLinks: string[];
  monetizationAngle?: string;
  cta?: string;
  confidence: number;
  warnings: string[];
}

export interface Opportunity {
  id?: number;
  lang: Locale;
  topic: string;
  source: 'search' | 'gsc' | 'manual' | 'ai';
  reason: string;
  priority: number;
  commercialIntent: number;
  seasonalRelevance?: string;
  musicianProfile?: string;
  status: 'identified' | 'researching' | 'drafting' | 'review' | 'approved' | 'published' | 'rejected';
}

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

function generateSlug(title: string, lang: Locale): string {
  const langMap: Record<Locale, string> = {
    es: 'como-',
    en: 'how-to-',
    pt: 'como-'
  };
  
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60);
  
  return `${langMap[lang]}${slugBase}`.replace(/--/g, '-');
}

export async function analyzeOpportunity(
  env: App.Locals['env'],
  request: ContentRequest
): Promise<ContentResponse> {
  const context = buildContext(request);
  
  const systemPrompt = `Eres un editor-chef editorial experto para músicos. Tu trabajo es analizar datos de búsqueda y crear briefs de contenido optimizados para SEO y monetización.

CONTEXTO DEL SITIO:
- mp3-musica.com es un sitio para músicos (principiantes, independientes, profesionales)
- Idiomas: español (es), inglés (en), portugués (pt)
- Categorías: reviews, tutorials, courses, gear, streaming

REGLAS:
1. Solo generas contenido ÚTIL y basado en datos reales
2. No inventas hechos o precios
3. Priorizas contenido con intención comercial cuando hay señales claras
4. Consideras estacionalidad (lanzamientos, festivales, Black Friday, etc.)
5. El slug debe estar optimizado para el idioma específico
6. Siempre generas: title, seo_title, meta_description, slug, excerpt, outline, faqs, internal_links
7. Cuando hay intención comercial alta, propones ángulo de monetización

RESPONDE ÚNICAMENTE EN JSON válido con esta estructura exacta:
{
  "title": "string",
  "seo_title": "string",
  "meta_description": "string",
  "slug": "string", 
  "excerpt": "string",
  "body": "string (HTML básico)",
  "outline": ["string"],
  "faqs": [{"question": "string", "answer": "string"}],
  "internal_links": ["/es/slug", "/en/slug"],
  "monetization_angle": "string (opcional)",
  "cta": "string (opcional)",
  "confidence": 0-100,
  "warnings": ["string"]
}`;

  const userPrompt = `Analiza y genera contenido para:

TEMA: ${request.topic}
IDIOMA: ${request.lang}
TIPO: ${request.type}
INTENCIÓN: ${request.intent}
PERFIL DE MÚSICO: ${request.musicianProfile || 'general'}
RELEVANCIA ESTACIONAL: ${request.seasonalRelevance || 'evergreen'}
INTENCIÓN COMERCIAL: ${request.commercialIntent || 0}/10

DATOS DISPONIBLES:
${context}

INSTRUCCIONES:
1. Analiza los datos proporcionados
2. Decide si crear contenido nuevo, actualizar, o fusionar
3. Genera el brief completo en el idioma solicitado
4. Si la intención comercial es alta (≥7), incluye ángulo de monetización
5. Propones CTAs relevantes para el perfil de músico`;

  try {
    const accountId = env.CF_ACCOUNT_ID || 'a7c021006de5c9322a5c7fe61b2c8cff';
    const aiResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API failed: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    
    if (!data.result?.response) {
      console.error('AI response missing:', data);
      throw new Error('Invalid AI response');
    }
    
    const content = JSON.parse(data.result.response);
    
    return {
      title: content.title || request.topic,
      seoTitle: content.seo_title || content.title || request.topic,
      metaDescription: content.meta_description || '',
      slug: content.slug || generateSlug(content.title || request.topic, request.lang),
      excerpt: content.excerpt || '',
      body: content.body || '',
      outline: content.outline || [],
      faqs: content.faqs || [],
      internalLinks: content.internal_links || [],
      monetizationAngle: content.monetization_angle,
      cta: content.cta,
      confidence: content.confidence || 50,
      warnings: content.warnings || []
    };
  } catch (e) {
    console.error('AI generation error:', e);
    
    return {
      title: request.topic,
      seoTitle: `${request.topic} | mp3-musica.com`,
      metaDescription: `Aprende sobre ${request.topic} en mp3-musica.com`,
      slug: generateSlug(request.topic, request.lang),
      excerpt: '',
      body: '',
      outline: [],
      faqs: [],
      internalLinks: [],
      confidence: 0,
      warnings: ['Error al generar contenido con IA']
    };
  }
}

function buildContext(request: ContentRequest): string {
  let context = '';
  
  if (request.sourceData?.searchInsights?.length) {
    context += `BÚSQUEDAS RELACIONADAS:\n${request.sourceData.searchInsights.map(q => `- ${q}`).join('\n')}\n\n`;
  }
  
  if (request.sourceData?.gscQueries?.length) {
    context += `QUERIES DE GOOGLE SEARCH CONSOLE:\n${request.sourceData.gscQueries.map(q => `- ${q}`).join('\n')}\n\n`;
  }
  
  if (request.sourceData?.existingContent?.length) {
    context += `CONTENIDO EXISTENTE RELACIONADO:\n${request.sourceData.existingContent.join('\n')}\n\n`;
  }
  
  return context || 'Sin datos disponibles. Genera contenido base.';
}

export async function createOpportunity(
  env: App.Locals['env'],
  opportunity: Opportunity
): Promise<number> {
  try {
    if (!env.DB) {
      console.error('DB not available');
      return -1;
    }

    const result = await env.DB.prepare(`
      INSERT INTO topic_opportunities (lang, topic, source, reason, priority, commercial_intent, seasonal_relevance, musician_profile, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      opportunity.lang,
      opportunity.topic,
      opportunity.source,
      opportunity.reason,
      opportunity.priority,
      opportunity.commercialIntent,
      opportunity.seasonalRelevance || null,
      opportunity.musicianProfile || null,
      opportunity.status
    ).run();

    return result.meta?.last_row_id || -1;
  } catch (e) {
    console.error('Create opportunity error:', e);
    return -1;
  }
}

export async function getTopSearchOpportunities(
  env: App.Locals['env'],
  lang: Locale,
  days: number = 7,
  limit: number = 10
): Promise<Opportunity[]> {
  try {
    if (!env.DB) return [];

    const results = await env.DB.prepare(`
      SELECT normalized_query, COUNT(*) as count, MAX(results_count) as last_results
      FROM search_logs 
      WHERE lang = ? AND created_at >= date('now', '-${days} days') AND zero_results = 1
      GROUP BY normalized_query
      ORDER BY count DESC
      LIMIT ?
    `).bind(lang, limit).all();

    return (results.results || []).map((row: any) => ({
      lang,
      topic: row.normalized_query,
      source: 'search' as const,
      reason: `${row.count} búsquedas sin resultados en los últimos ${days} días`,
      priority: Math.min(10, Math.max(1, row.count)),
      commercialIntent: row.last_results === 0 ? 8 : 3,
      status: 'identified' as const
    }));
  } catch (e) {
    console.error('Get search opportunities error:', e);
    return [];
  }
}

export async function analyzeGSCForOpportunities(
  env: App.Locals['env'],
  lang: Locale,
  days: number = 28
): Promise<Opportunity[]> {
  try {
    if (!env.DB) return [];

    const results = await env.DB.prepare(`
      SELECT query, SUM(clicks) as clicks, AVG(position) as avg_position
      FROM gsc_query_insights 
      WHERE lang = ? AND created_at >= date('now', '-${days} days')
      GROUP BY query
      HAVING clicks > 5 AND avg_position > 10
      ORDER BY clicks DESC
      LIMIT 20
    `).bind(lang).all();

    return (results.results || []).map((row: any) => ({
      lang,
      topic: row.query,
      source: 'gsc' as const,
      reason: `Alto tráfico (${row.clicks} clicks) pero posición mejorable (${row.avg_position.toFixed(1)})`,
      priority: Math.min(10, Math.max(1, Math.floor(row.clicks / 5))),
      commercialIntent: row.avg_position > 15 ? 7 : 4,
      status: 'identified' as const
    }));
  } catch (e) {
    console.error('GSC opportunities error:', e);
    return [];
  }
}

export interface ArticleOutline {
  title: string;
  slug: string;
  silos: string[];
  keywords: string[];
  wordCount: number;
  readTime: number;
}

export interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  sections: ArticleSection[];
}

export interface ArticleSection {
  heading: string;
  content: string;
  keywords: string[];
}

export interface ContentConfig {
  lang: 'es' | 'en' | 'pt';
  silo: string;
  topic: string;
  keywords: string[];
  tone: 'professional' | 'friendly' | 'educational';
  wordCount?: number;
}
