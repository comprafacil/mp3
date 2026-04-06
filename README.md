# mp3 - Music Content Platform

A multilingual music content platform built with SvelteKit and Cloudflare Pages.

## Tech Stack

- **Framework**: SvelteKit 2.x
- **Adapter**: @sveltejs/adapter-cloudflare
- **Styling**: TailwindCSS
- **i18n**: svelte-i18n
- **Database**: Cloudflare D1
- **Cache**: Cloudflare KV

## Languages

- 🇪🇸 Spanish (es)
- 🇬🇧 English (en)
- 🇧🇷 Portuguese (pt)

## Project Structure

```
src/
├── lib/
│   ├── i18n/          # Internationalization
│   └── seo/           # SEO schemas
├── components/        # Reusable components
├── routes/
│   ├── [lang]/        # Language routes
│   │   ├── reviews/   # Review articles
│   │   ├── tutorials/ # Tutorials
│   │   ├── courses/   # Courses
│   │   ├── gear/      # Gear reviews
│   │   └── streaming/ # Streaming content
│   └── api/           # API routes
└── hooks.server.ts    # Server hooks (i18n)
```

## Setup

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build
```

## Cloudflare Setup

### 1. Create Resources

```bash
# D1 Database
wrangler d1 create mp3

# KV Namespaces
wrangler kv namespace create mp3-cache
wrangler kv namespace create mp3-sessions

# R2 Bucket
wrangler r2 bucket create mp3-assets
```

### 2. Update wrangler.toml

Add your resource IDs to `wrangler.toml`.

### 3. Run Database Migration

```bash
wrangler d1 execute mp3 --file=./d1/schema.sql
```

## Deployment

### GitHub Actions

1. Add secrets to GitHub:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. Push to main branch - deployment starts automatically.

### Manual Deploy

```bash
npm run build
npx wrangler pages deploy .svelte-kit/output
```

## SEO Features

- ✅ hreflang tags (all languages)
- ✅ Schema: Article, FAQ, Product, Breadcrumb
- ✅ Open Graph + Twitter Cards
- ✅ Sitemap.xml (per language with hreflang)
- ✅ Robots.txt

## Revenue Goal

Target: $1M/year

### Monetization Strategy

| Stream | Monthly Target |
|--------|---------------|
| Ads (AdSense → MediaVine → AdThrive) | $50,000 |
| Affiliates (Amazon, etc.) | $15,000 |
| Membership/Subscriptions | $15,000 |
| Other | $3,333 |

## License

All rights reserved © 2025 mp3
