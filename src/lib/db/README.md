// Database connection utilities for Cloudflare D1
// Usage in +page.server.ts:
//
// export const load = async ({ locals }) => {
//   const db = locals.env.DB;
//   const results = await db.prepare('SELECT * FROM articles').all();
// };

// Example queries:
/*
// Get all articles
const articles = await db.prepare(`
  SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC
`).all();

// Get article by slug
const article = await db.prepare(`
  SELECT * FROM articles WHERE slug = ? AND lang = ?
`).bind('my-article-slug', 'es').first();

// Insert subscriber
await db.prepare(`
  INSERT INTO subscribers (email, lang) VALUES (?, ?)
`).bind('user@example.com', 'es').run();

// Get analytics
const analytics = await db.prepare(`
  SELECT * FROM article_analytics WHERE date = ?
`).bind('2025-04-05').first();
*/

// Telegram notification example:
/*
export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) return;
  
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });
}
*/

// Turnstile verification example:
/*
export async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: ip
    })
  });
  
  const result = await response.json();
  return result.success;
}
*/
