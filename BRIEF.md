# mp3-musica.com - Project Brief

## 1. Project Overview

**Project Name:** mp3-musica.com
**Type:** Multilingual Music Content Platform (SvelteKit + Cloudflare Pages)
**Goal:** $1M revenue in 24 months
**Target Markets:** Spanish-speaking (ES), English-speaking (EN), Portuguese-speaking (PT)

## 2. Core Architecture

### Tech Stack
- **Frontend:** SvelteKit with @sveltejs/adapter-cloudflare
- **Hosting:** Cloudflare Pages
- **Database:** Cloudflare D1 (SQLite)
- **Cache/Analytics:** Cloudflare KV
- **File Storage:** Cloudflare R2
- **Bot Protection:** Cloudflare Turnstile
- **AI:** Cloudflare Workers AI
- **Email:** Resend
- **Payments:** Stripe
- **Ads:** AdSense / MediaVine

### URL Structure (SEO-Optimized)
```
/es/          - Spanish homepage
/es/buscar    - Search page (ES)
/es/reviews   - Reviews listing
/es/reviews/[slug] - Review detail
/es/privacidad - Privacy policy (ES)
/es/terminos   - Terms of service (ES)
/es/cookies   - Cookie policy
/es/admin     - Admin dashboard
/es/streaming - Streaming guides
/es/courses   - Music courses
/es/tutorials - Tutorials
/es/gear      - Music gear

/en/          - English homepage
/en/search    - Search page (EN)
//en/privacy   - Privacy policy (EN)
//en/terms     - Terms of service (EN)
/... (same structure)

/pt/          - Portuguese homepage
/pt/buscar    - Search page (PT)
/pt/privacidade - Privacy policy (PT)
/pt/termos     - Terms of service (PT)
/... (same structure)
```

## 3. Features

### 3.1 Content Pages
- Homepage with featured content
- Reviews (music, gear, courses, tutorials)
- Streaming guides
- Music courses
- Tutorials
- Gear/equipment reviews

### 3.2 Search System
- **Search with autocomplete** - Real-time suggestions as user types
- **Search results page** - Filterable results with pagination
- **Trending searches** - Popular queries displayed
- **Search analytics** - Track popular searches in KV

### 3.3 Multilingual Support
- Full i18n system with ES/EN/PT
- Language switcher in header
- SEO hreflang tags
- Localized URLs

### 3.4 Admin Dashboard (/[lang]/admin)
- Content management (CRUD)
- AI content generation
- Search analytics/trending
- Newsletter subscribers
- Analytics overview

### 3.5 SEO Features
- XML sitemap with hreflang
- Robots.txt
- Schema.org structured data
- Canonical URLs
- Open Graph / Twitter Cards

### 3.6 RSS Feeds
- Global RSS feed
- Per-category feeds

### 3.7 Integrations

#### Cloudflare Services
| Service | Purpose |
|---------|---------|
| D1 | Main database (content, users, analytics) |
| KV | Search analytics, trending, caching |
| R2 | File storage (images, PDFs, downloads) |
| Turnstile | Bot protection on forms |
| Workers AI | AI content generation |
| Cache | Edge caching for performance |

#### Third-Party
| Service | Purpose |
|---------|---------|
| Stripe | Subscription payments |
| Resend | Email newsletters |
| Telegram | Admin notifications |
| Google Search Console | SEO verification |
| AdSense/MediaVine | Ad revenue |

## 4. Database Schema (D1)

```sql
-- Reviews table
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  lang TEXT NOT NULL,
  author TEXT,
  image_url TEXT,
  published_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

-- Search analytics
CREATE TABLE search_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  results_count INTEGER,
  lang TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  lang TEXT NOT NULL,
  confirmed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Trending searches (cached in KV)
-- Store top 100 searches per language
```

## 5. API Endpoints

```
GET  /[lang]/api/search?q=query        - Search with autocomplete
POST /[lang]/api/subscribe             - Newsletter signup
POST /[lang]/api/ai/generate            - AI content generation (admin)
GET  /[lang]/api/analytics              - Search analytics (admin)
GET  /[lang]/feed.xml                   - RSS feed
GET  /sitemap.xml                       - Sitemap with hreflang
```

## 6. Environment Variables

```env
# Cloudflare
CF_ACCOUNT_ID=
CF_D1_DATABASE_ID=
CF_KV_NAMESPACE_ID=
CF_R2_BUCKET_NAME=
CF_TURNSTILE_SITE_KEY=
CF_TURNSTILE_SECRET_KEY=

# Third-Party
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
GOOGLE_Search_CONSOLE_VERIFICATION=

# AdSense
ADSENSE_PUB_ID=

# App
ADMIN_PASSWORD=
JWT_SECRET=
```

## 7. Design Requirements

### Header
- Logo: "mp3-musica" (not just "mp3")
- Navigation: Home, Reviews, Search
- Language switcher: EN/ES/PT
- Search button with autocomplete

### Footer
- Language-specific legal links
- Social links
- Copyright

### Responsive
- Mobile-first design
- Tailwind CSS

## 8. Revenue Model

### Primary Revenue Streams
1. **Display Ads** - AdSense/MediaVine ($0.5-5 CPM)
2. **Affiliate** - Gear reviews with Amazon/other affiliates
3. **Subscriptions** - Premium content via Stripe ($5-15/mo)
4. **Courses** - Paid music courses

### Traffic Targets
- Month 6: 10,000 monthly visits
- Month 12: 100,000 monthly visits
- Month 24: 500,000 monthly visits

### Revenue Projections (24 months)
- Month 6: $500/mo
- Month 12: $5,000/mo
- Month 24: $50,000/mo (run rate)

## 9. Deployment

### GitHub Actions CI/CD
```yaml
# Deploy on push to main
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: mp3-musica
          directory: .svelte-kit/cloudflare
```

### Cloudflare Setup
1. Create D1 database
2. Run schema.sql
3. Create KV namespace
4. Create R2 bucket
5. Configure Turnstile
6. Set up custom domain

## 10. Success Metrics

- [ ] Site loads < 2s (Core Web Vitals)
- [ ] All 3 languages working
- [ ] SEO ranking for target keywords
- [ ] Search with autocomplete functional
- [ ] Admin dashboard operational
- [ ] Newsletter signup working
- [ ] Ads displaying
- [ ] First revenue ($100/mo)

## 11. Timeline

### Phase 1: Foundation (Weeks 1-2)
- [x] SvelteKit project setup
- [x] Cloudflare Pages deployment
- [x] i18n system
- [x] Basic pages

### Phase 2: Features (Weeks 3-4)
- [x] Search with autocomplete
- [x] Admin dashboard
- [x] AI content generation
- [x] RSS/Sitemap

### Phase 3: Integrations (Weeks 5-6)
- [ ] D1 database
- [ ] Turnstile
- [ ] Telegram notifications
- [ ] Resend (newsletter)
- [ ] Stripe (payments)

### Phase 4: Monetization (Weeks 7-8)
- [ ] AdSense/MediaVine
- [ ] Affiliate links
- [ ] Premium content

### Phase 5: Scale (Weeks 9-24)
- [ ] Content expansion
- [ ] SEO optimization
- [ ] Analytics setup
- [ ] Marketing

---

**Document Status:** In Progress
**Last Updated:** 2026-04-05
