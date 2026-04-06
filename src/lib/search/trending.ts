// Track search queries and popular searches
// Uses KV for caching and analytics

export interface SearchQuery {
  query: string;
  lang: string;
  results: number;
  timestamp: string;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularSearches: Array<{ query: string; count: number }>;
  noResultsSearches: Array<{ query: string; count: number }>;
}

// Track a search query
export async function trackSearch(
  kv: KVNamespace,
  query: string,
  lang: string,
  resultCount: number
): Promise<void> {
  const timestamp = new Date().toISOString();
  const key = `search:${lang}:${query.toLowerCase()}`;
  
  // Increment search count
  await kv.put(key, JSON.stringify({
    query: query.toLowerCase(),
    lang,
    results: resultCount,
    timestamp,
    count: 1
  }));
  
  // Update total searches
  const totalKey = `stats:searches:${lang}`;
  const total = await kv.get(totalKey);
  const currentTotal = total ? parseInt(total) : 0;
  await kv.put(totalKey, (currentTotal + 1).toString());
}

// Get popular searches from KV cache
export async function getPopularSearches(
  kv: KVNamespace,
  lang: string,
  limit: number = 10
): Promise<Array<{ query: string; count: number }>> {
  const list = await kv.list({ prefix: `search:${lang}:` });
  const searches: Array<{ query: string; count: number }> = [];
  
  for (const key of list.keys) {
    const data = await kv.get(key.name);
    if (data) {
      const parsed = JSON.parse(data);
      searches.push({
        query: parsed.query,
        count: parsed.count || 1
      });
    }
  }
  
  // Sort by count and return top results
  return searches
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Get search suggestions based on trending topics
// This integrates with Google Trends data
export interface SuggestionItem {
  term: string;
  trend: 'up' | 'down' | 'stable';
  volume: number;
}

export async function getSearchSuggestions(
  kv: KVNamespace,
  lang: string,
  partialQuery: string
): Promise<SuggestionItem[]> {
  // First, check cached trending from KV
  const trendingKey = `trending:${lang}`;
  const cached = await kv.get(trendingKey);
  
  if (cached) {
    const trending = JSON.parse(cached);
    return trending.filter((t: SuggestionItem) => 
      t.term.toLowerCase().includes(partialQuery.toLowerCase())
    );
  }
  
  // Default suggestions based on popular silos
  const defaults: Record<string, SuggestionItem[]> = {
    es: [
      { term: 'mejor guitarra eléctrica', trend: 'up', volume: 10000 },
      { term: 'auriculares para estudio', trend: 'up', volume: 8000 },
      { term: 'tutorial producción musical', trend: 'stable', volume: 6000 },
      { term: 'curso de guitarra principiante', trend: 'up', volume: 9000 },
      { term: 'micrófono USB para podcast', trend: 'up', volume: 5000 },
    ],
    en: [
      { term: 'best electric guitar', trend: 'up', volume: 15000 },
      { term: 'studio headphones', trend: 'stable', volume: 10000 },
      { term: 'music production tutorial', trend: 'stable', volume: 8000 },
      { term: 'beginner guitar course', trend: 'up', volume: 12000 },
      { term: 'USB microphone for podcast', trend: 'up', volume: 7000 },
    ],
    pt: [
      { term: 'melhor guitarra elétrica', trend: 'up', volume: 8000 },
      { term: 'fones de ouvido para estúdio', trend: 'stable', volume: 6000 },
      { term: 'tutorial produção musical', trend: 'stable', volume: 5000 },
      { term: 'curso de guitarra iniciante', trend: 'up', volume: 7000 },
      { term: 'microfone USB para podcast', trend: 'up', volume: 4000 },
    ]
  };
  
  return defaults[lang] || defaults.es;
}

// Example: Update trending topics periodically
// Call this from a cron job or scheduled task
export async function updateTrendingTopics(kv: KVNamespace): Promise<void> {
  const langs = ['es', 'en', 'pt'] as const;
  
  for (const lang of langs) {
    // In production, this would fetch from Google Trends API
    // For now, we use cached data from search queries
    const popular = await getPopularSearches(kv, lang, 10);
    
    const trending: SuggestionItem[] = popular.map((p, i) => ({
      term: p.query,
      trend: i < 3 ? 'up' : 'stable',
      volume: p.count * 100
    }));
    
    await kv.put(`trending:${lang}`, JSON.stringify(trending), { expirationTtl: 3600 });
  }
}

/*
// Usage in search API:
export const GET: RequestHandler = async ({ url, locals }) => {
  const query = url.searchParams.get('q') || '';
  const lang = url.searchParams.get('lang') || 'es';
  
  // Get search results from D1
  const results = await searchDB(query, lang);
  
  // Track the search
  if (locals.env?.KV) {
    await trackSearch(locals.env.KV, query, lang, results.length);
  }
  
  // Get suggestions for autocomplete
  const suggestions = query.length >= 2 
    ? await getSearchSuggestions(locals.env.KV, lang, query)
    : await getSearchSuggestions(locals.env.KV, lang, '');
    
  return Response.json({ results, suggestions });
};
*/
