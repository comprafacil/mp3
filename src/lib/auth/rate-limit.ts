export interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
}

const defaultConfig: Record<string, RateLimitConfig> = {
  login: { windowSeconds: 300, maxRequests: 5 },
  api: { windowSeconds: 60, maxRequests: 100 },
  search: { windowSeconds: 60, maxRequests: 30 }
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  env: App.Locals['env'],
  identifier: string,
  action: string = 'default'
): Promise<RateLimitResult> {
  const defaultResult: RateLimitResult = {
    allowed: true,
    remaining: 999,
    resetAt: new Date(Date.now() + 60000)
  };

  if (!env?.DB) return defaultResult;

  const config = defaultConfig[action] || defaultConfig.api;
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowSeconds * 1000);

  try {
    const existing = await env.DB.prepare(`
      SELECT count, window_start, window_end
      FROM rate_limits 
      WHERE identifier = ? AND action = ? AND window_end > datetime('now')
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(identifier, action).first() as any;

    if (existing && existing.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(existing.window_end)
      };
    }

    if (existing) {
      await env.DB.prepare(`
        UPDATE rate_limits SET count = count + 1 WHERE id = (
          SELECT id FROM rate_limits WHERE identifier = ? AND action = ? ORDER BY created_at DESC LIMIT 1
        )
      `).bind(identifier, action).run();
      
      return {
        allowed: true,
        remaining: config.maxRequests - (existing.count + 1),
        resetAt: new Date(existing.window_end)
      };
    } else {
      const windowEnd = new Date(now.getTime() + config.windowSeconds * 1000);
      await env.DB.prepare(`
        INSERT INTO rate_limits (identifier, action, count, window_start, window_end)
        VALUES (?, ?, 1, ?, ?)
      `).bind(identifier, action, windowStart.toISOString(), windowEnd.toISOString()).run();
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: windowEnd
      };
    }
  } catch (e) {
    console.error('Rate limit check error:', e);
    return defaultResult;
  }
}

export async function getRemainingRequests(
  env: App.Locals['env'],
  identifier: string,
  action: string = 'default'
): Promise<number> {
  if (!env?.DB) return 999;

  const config = defaultConfig[action] || defaultConfig.api;

  try {
    const result = await env.DB.prepare(`
      SELECT count FROM rate_limits 
      WHERE identifier = ? AND action = ? AND window_end > datetime('now')
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(identifier, action).first() as any;

    if (!result) return config.maxRequests;
    return Math.max(0, config.maxRequests - result.count);
  } catch {
    return config.maxRequests;
  }
}
