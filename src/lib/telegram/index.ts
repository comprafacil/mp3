// Telegram notification module
// Sends notifications to a Telegram channel when new content is published

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface TelegramMessage {
  text: string;
  parseMode?: 'Markdown' | 'HTML';
  disableWebPagePreview?: boolean;
}

// Send a message to Telegram
export async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.log('Telegram not configured');
    return false;
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.text,
        parse_mode: message.parseMode || 'Markdown',
        disable_web_page_preview: message.disableWebPagePreview || true
      })
    });
    
    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Telegram error:', error);
    return false;
  }
}

// Notify when new article is published
export async function notifyNewArticle(article: {
  title: string;
  slug: string;
  silo: string;
  lang: string;
}): Promise<void> {
  const langNames: Record<string, string> = {
    es: 'Español',
    en: 'English',
    pt: 'Português'
  };
  
  const siloNames: Record<string, string> = {
    reviews: 'Reviews',
    tutorials: 'Tutoriales',
    courses: 'Cursos',
    gear: 'Equipos',
    streaming: 'Streaming'
  };
  
  const message = `
🎵 *Nuevo artículo publicado en mp3-musica.com*

*Título:* ${article.title}
*Categoría:* ${siloNames[article.silo] || article.silo}
*Idioma:* ${langNames[article.lang] || article.lang}

🔗 https://www.mp3-musica.com/${article.lang}/${article.silo}/${article.slug}
  `.trim();
  
  await sendTelegramMessage({ text: message });
}

// Notify when new subscriber
export async function notifyNewSubscriber(email: string, lang: string): Promise<void> {
  const message = `
👤 *Nuevo suscriptor*

*Email:* ${email}
*Idioma:* ${lang}
  `.trim();
  
  await sendTelegramMessage({ text: message });
}

// Notify when affiliate click
export async function notifyAffiliateClick(program: string, article: string): Promise<void> {
  const message = `
💰 *Click de afiliado*

*Programa:* ${program}
*Artículo:* ${article}
  `.trim();
  
  await sendTelegramMessage({ text: message });
}

// Example usage:
/*
import { notifyNewArticle, notifyNewSubscriber } from '$lib/telegram';

// In your article publish API:
await notifyNewArticle({
  title: 'Las mejores guitarras 2025',
  slug: 'mejores-guitarras-2025',
  silo: 'reviews',
  lang: 'es'
});

// In your subscribe API:
await notifyNewSubscriber(email, 'es');
*/
