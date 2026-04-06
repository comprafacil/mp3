// Cloudflare AI Content Generation Module
// Uses Workers AI for generating high-quality, natural content

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

// Prompt templates per language
const prompts = {
  es: {
    outline: `Genera un esquema de artículo SEO optimizado para mp3-musica.com sobre "{topic}". 
Incluye: título slug keywords relacionadas. 
Responde en JSON válido.`,
    
    article: `Eres un escritor profesional de contenido musical. Escribe un artículo completo y natural sobre "{title}" para mp3-musica.com.

Requisitos:
- Tono: {tone}
- Longitud: {wordCount} palabras
- SEO: Incluye naturalmente las keywords: {keywords}
- Estructura: H2s descriptivos, párrafos sustanciales
- No uses listas excesivas, escribe narrativamente
- Incluye introducción, desarrollo y conclusión
- El contenido debe ser 100% natural y útil para lectores

Título: {title}
Keywords objetivo: {keywords}

Escribe el artículo completo ahora:`,
    
    meta: `Genera meta título y descripción SEO para:
Título: {title}
Contenido: {excerpt}
Keywords: {keywords}

Responde en JSON: { "metaTitle": "...", "metaDescription": "..." }`
  },
  en: {
    outline: `Generate an SEO-optimized article outline for mp3-musica.com about "{topic}".
Include: title, slug, related keywords.
Respond in valid JSON.`,
    
    article: `You are a professional music content writer. Write a complete, natural article about "{title}" for mp3-musica.com.

Requirements:
- Tone: {tone}
- Length: {wordCount} words
- SEO: Naturally include keywords: {keywords}
- Structure: Descriptive H2s, substantial paragraphs
- Don't overuse lists, write narratively
- Include introduction, development, and conclusion
- Content must be 100% natural and useful for readers

Title: {title}
Target keywords: {keywords}

Write the complete article now:`,
    
    meta: `Generate SEO meta title and description for:
Title: {title}
Content: {excerpt}
Keywords: {keywords}

Respond in JSON: { "metaTitle": "...", "metaDescription": "..." }`
  },
  pt: {
    outline: `Gere um esboço de artigo otimizado para SEO para mp3-musica.com sobre "{topic}".
Inclua: título, slug, palavras-chave relacionadas.
Responda em JSON válido.`,
    
    article: `Você é um escritor profissional de conteúdo musical. Escreva um artigo completo e natural sobre "{title}" para mp3-musica.com.

Requisitos:
- Tom: {tone}
- Comprimento: {wordCount} palavras
- SEO: Inclua naturalmente as palavras-chave: {keywords}
- Estrutura: H2s descritivos, parágrafos substanciais
- Não use listas em excesso, escreva narrativamente
- Inclua introdução, desenvolvimento e conclusão
- O conteúdo deve ser 100% natural e útil para os leitores

Título: {title}
Palavras-chave-alvo: {keywords}

Escreva o artigo completo agora:`,
    
    meta: `Gere título e descrição meta para SEO:
Título: {title}
Conteúdo: {excerpt}
Keywords: {keywords}

Responda em JSON: { "metaTitle": "...", "metaDescription": "..." }`
  }
};

// Cloudflare AI wrapper
export class ContentAI {
  private model = '@cf/meta/llama-3.1-8b-instruct';
  
  async generateOutline(config: ContentConfig): Promise<ArticleOutline> {
    const prompt = prompts[config.lang].outline.replace('{topic}', config.topic);
    
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_CLOUDFLARE_API_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    return JSON.parse(data.result.response);
  }
  
  async generateArticle(config: ContentConfig, title: string): Promise<GeneratedArticle> {
    const wordCount = config.wordCount || 1500;
    const prompt = prompts[config.lang].article
      .replace('{title}', title)
      .replace('{wordCount}', wordCount.toString())
      .replace('{keywords}', config.keywords.join(', '))
      .replace('{tone}', config.tone === 'educational' ? 'educativo' : config.tone === 'friendly' ? 'amigable' : 'profesional');
    
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_CLOUDFLARE_API_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000
      })
    });
    
    const data = await response.json();
    const content = data.result.response;
    
    // Extract H2s
    const h2s = content.match(/^##\s+.+$/gm)?.map(h => h.replace('## ', '')) || [];
    
    // Generate excerpt (first 160 chars)
    const excerpt = content.substring(0, 160).replace(/[#*]/g, '').trim() + '...';
    
    return {
      title,
      content,
      excerpt,
      metaTitle: `${title} | mp3-musica.com`,
      metaDescription: excerpt,
      h1: title,
      h2s,
      sections: h2s.map(h => ({ heading: h, content: '', keywords: config.keywords }))
    };
  }
  
  async generateMeta(title: string, excerpt: string, keywords: string[]): Promise<{metaTitle: string; metaDescription: string }> {
    const prompt = prompts.es.meta
      .replace('{title}', title)
      .replace('{excerpt}', excerpt)
      .replace('{keywords}', keywords.join(', '));
    
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_CLOUDFLARE_API_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      })
    });
    
    const data = await response.json();
    return JSON.parse(data.result.response);
  }
}

// Content generation workflow
export async function generateContentFlow(config: ContentConfig): Promise<GeneratedArticle> {
  const ai = new ContentAI();
  
  // Step 1: Generate outline
  const outline = await ai.generateOutline(config);
  
  // Step 2: Generate article
  const article = await ai.generateArticle(config, outline.title);
  
  // Step 3: Generate meta
  const meta = await ai.generateMeta(article.title, article.excerpt, config.keywords);
  
  return {
    ...article,
    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription
  };
}

// Example usage in API route:
/*
import { generateContentFlow } from '$lib/ai/content';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { topic, keywords, silo, lang } = await request.json();
  
  const article = await generateContentFlow({
    topic,
    keywords,
    silo,
    lang: lang || 'es',
    tone: 'educational',
    wordCount: 2000
  });
  
  // Save to D1
  if (locals.env?.DB) {
    await locals.env.DB.prepare(`
      INSERT INTO articles (title, slug, lang, silo_slug, content, meta_title, meta_description, excerpt, status, word_count, read_time, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?)
    `).bind(
      article.title,
      article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      lang,
      silo,
      article.content,
      article.metaTitle,
      article.metaDescription,
      article.excerpt,
      article.content.split(' ').length,
      Math.ceil(article.content.split(' ').length / 200),
      new Date().toISOString()
    ).run();
  }
  
  return Response.json({ success: true, article });
};
*/
