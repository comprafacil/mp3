import type { RequestHandler } from './$types';

const TURNSTILE_SITE_KEY = '0x4AAAAAAC1GBYPT9A_A4N4k';
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { email, 'cf-turnstile-response': turnstileToken } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    // Verify Turnstile token if secret is configured
    if (TURNSTILE_SECRET_KEY && turnstileToken) {
      const verificationResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: TURNSTILE_SECRET_KEY,
            response: turnstileToken
          })
        }
      );

      const verification = await verificationResponse.json();

      if (!verification.success) {
        return Response.json(
          { success: false, error: 'Turnstile verification failed' },
          { status: 400 }
        );
      }
    }

    // Save to D1 if available
    try {
      if (locals.env?.DB) {
        await locals.env.DB.prepare(`
          INSERT INTO subscribers (email, lang, ip, user_agent, source)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          email,
          'es',
          request.headers.get('x-forwarded-for') || 'unknown',
          request.headers.get('user-agent') || 'unknown',
          'website'
        ).run();
      }
    } catch (e) {
      console.log('D1 not available, subscription stored locally:', e);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
