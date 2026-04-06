-- mp3 D1 Database Schema

-- Silos (Categories)
CREATE TABLE IF NOT EXISTS silos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_pt TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  description_pt TEXT,
  pillar_article_slug TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  lang TEXT NOT NULL CHECK(lang IN ('es', 'en', 'pt')),
  silo_slug TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  og_image TEXT,
  author_name TEXT DEFAULT 'mp3 Editorial',
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
  word_count INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 5,
  published_at TEXT,
  last_modified TEXT,
  last_refreshed TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, lang)
);

CREATE INDEX idx_articles_slug_lang ON articles(slug, lang);
CREATE INDEX idx_articles_silo ON articles(silo_slug, lang, status);
CREATE INDEX idx_articles_published ON articles(published_at DESC);

-- Keywords
CREATE TABLE IF NOT EXISTS keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  volume INTEGER,
  difficulty INTEGER,
  cpc REAL,
  article_id INTEGER,
  lang TEXT CHECK(lang IN ('es', 'en', 'pt')),
  source TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(article_id) REFERENCES articles(id)
);

CREATE INDEX idx_keywords_article ON keywords(article_id);
CREATE INDEX idx_keywords_lang ON keywords(lang);

-- Internal Links
CREATE TABLE IF NOT EXISTS article_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_article_id INTEGER NOT NULL,
  to_article_id INTEGER NOT NULL,
  link_type TEXT NOT NULL CHECK(link_type IN ('contextual', 'related', 'in-content')),
  anchor_text TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(from_article_id) REFERENCES articles(id),
  FOREIGN KEY(to_article_id) REFERENCES articles(id)
);

-- Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program TEXT NOT NULL CHECK(program IN ('amazon', 'guitarcenter', 'sweetwater', 'reverb', 'thomann', 'other')),
  url TEXT NOT NULL,
  product_id TEXT,
  category TEXT,
  commission_rate REAL,
  cookie_days INTEGER DEFAULT 30,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate Clicks
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug TEXT NOT NULL,
  lang TEXT NOT NULL,
  affiliate_program TEXT NOT NULL,
  affiliate_link_id INTEGER,
  ip TEXT,
  user_agent TEXT,
  clicked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(affiliate_link_id) REFERENCES affiliate_links(id)
);

CREATE INDEX idx_affiliate_clicks_article ON affiliate_clicks(article_slug, lang);

-- Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  lang TEXT DEFAULT 'es' CHECK(lang IN ('es', 'en', 'pt')),
  ip TEXT,
  user_agent TEXT,
  source TEXT DEFAULT 'website',
  confirmed INTEGER DEFAULT 0,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscribers_email ON subscribers(email);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'monthly' CHECK(plan IN ('monthly', 'yearly', 'lifetime')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'past_due', 'trialing')),
  started_at TEXT,
  current_period_start TEXT,
  current_period_end TEXT,
  canceled_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(email) REFERENCES subscribers(email)
);

-- Single Article Access
CREATE TABLE IF NOT EXISTS article_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  article_slug TEXT NOT NULL,
  lang TEXT NOT NULL,
  payment_id TEXT,
  amount_cents INTEGER DEFAULT 99,
  paid_at TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_article_access_email ON article_access(email);

-- Fraud Detection
CREATE TABLE IF NOT EXISTS fraud_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  article_id INTEGER,
  event_type TEXT CHECK(event_type IN ('suspicious_click', 'rapid_fraud', 'bot_detected')),
  details TEXT,
  detected_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_events_ip ON fraud_events(ip);

-- Blocked IPs
CREATE TABLE IF NOT EXISTS blocked_ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT UNIQUE NOT NULL,
  reason TEXT,
  blocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT
);

-- Article Analytics
CREATE TABLE IF NOT EXISTS article_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug TEXT NOT NULL,
  lang TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page REAL DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  ad_clicks INTEGER DEFAULT 0,
  adblock_detected INTEGER DEFAULT 0,
  paywall_shown INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  affiliate_revenue_cents INTEGER DEFAULT 0,
  date TEXT DEFAULT CURRENT_DATE,
  UNIQUE(article_slug, lang, date)
);

CREATE INDEX idx_analytics_date ON article_analytics(date);

-- Products (for reviews)
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  category TEXT,
  price_cents INTEGER,
  price_currency TEXT DEFAULT 'USD',
  affiliate_url TEXT,
  affiliate_program TEXT,
  image_url TEXT,
  available INTEGER DEFAULT 1,
  specs TEXT,
  last_price_check TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug)
);

-- Search Logs (Feedback System)
CREATE TABLE IF NOT EXISTS search_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL CHECK(lang IN ('es', 'en', 'pt')),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  zero_results INTEGER DEFAULT 0,
  source TEXT DEFAULT 'header',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_logs_query ON search_logs(normalized_query, lang);
CREATE INDEX idx_search_logs_created ON search_logs(created_at DESC);
CREATE INDEX idx_search_logs_zero ON search_logs(zero_results, created_at);

-- Topic Opportunities (Editorial Intelligence)
CREATE TABLE IF NOT EXISTS topic_opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL CHECK(lang IN ('es', 'en', 'pt')),
  topic TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('search', 'gsc', 'manual', 'ai')),
  reason TEXT,
  priority INTEGER DEFAULT 5 CHECK(priority BETWEEN 1 AND 10),
  commercial_intent INTEGER DEFAULT 0 CHECK(commercial_intent BETWEEN 0 AND 10),
  seasonal_relevance TEXT,
  musician_profile TEXT,
  status TEXT DEFAULT 'identified' CHECK(status IN ('identified', 'researching', 'drafting', 'review', 'approved', 'published', 'rejected')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE INDEX idx_opportunities_priority ON topic_opportunities(priority DESC, status);
CREATE INDEX idx_opportunities_lang ON topic_opportunities(lang, status);

-- GSC Snapshots
CREATE TABLE IF NOT EXISTS gsc_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_from TEXT NOT NULL,
  date_to TEXT NOT NULL,
  dimension_type TEXT NOT NULL CHECK(dimension_type IN ('query', 'page', 'country', 'device')),
  payload_hash TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- GSC Query Insights
CREATE TABLE IF NOT EXISTS gsc_query_insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL CHECK(lang IN ('es', 'en', 'pt')),
  query TEXT NOT NULL,
  page TEXT,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0,
  position REAL DEFAULT 0,
  country TEXT,
  device TEXT,
  snapshot_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(snapshot_id) REFERENCES gsc_snapshots(id)
);

CREATE INDEX idx_gsc_query ON gsc_query_insights(query, lang);
CREATE INDEX idx_gsc_clicks ON gsc_query_insights(clicks DESC);
CREATE INDEX idx_gsc_position ON gsc_query_insights(position);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  google_id TEXT,
  role TEXT DEFAULT 'editor' CHECK(role IN ('admin', 'editor', 'viewer')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

-- Admin Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_admin_sessions_user ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Rate Limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  window_start TEXT NOT NULL,
  window_end TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, action);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  is_public INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Default settings
INSERT OR IGNORE INTO site_settings (setting_key, setting_value, is_public) VALUES
('oauth_google_enabled', 'false', 1),
('oauth_google_client_id', '', 0),
('oauth_google_client_secret', '', 0),
('site_title', 'mp3-musica.com', 1),
('site_description', 'Tu guía definitiva para el mundo de la música', 1),
('google_analytics_id', '', 1),
('google_site_verification', '', 1);

-- Media Assets (R2)
CREATE TABLE IF NOT EXISTS media_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER,
  r2_key TEXT NOT NULL UNIQUE,
  alt_text TEXT,
  caption TEXT,
  lang TEXT DEFAULT 'es' CHECK(lang IN ('es', 'en', 'pt')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_r2 ON media_assets(r2_key);

-- Content (Core editorial table)
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL CHECK(lang IN ('es', 'en', 'pt')),
  type TEXT NOT NULL CHECK(type IN ('article', 'review', 'tutorial', 'course', 'guide', 'faq', 'landing')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'approved', 'published', 'updated', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  noindex INTEGER DEFAULT 0,
  author_name TEXT DEFAULT 'mp3 Editorial',
  source_type TEXT,
  source_reason TEXT,
  seasonal_tag TEXT,
  monetization_type TEXT,
  commercial_intent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  published_at TEXT,
  UNIQUE(slug, lang)
);

CREATE INDEX idx_content_slug_lang ON content(slug, lang);
CREATE INDEX idx_content_status ON content(status, lang);
CREATE INDEX idx_content_published ON content(published_at DESC);
CREATE INDEX idx_content_monetization ON content(monetization_type, commercial_intent DESC);

-- Categories (Silos)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL CHECK(lang IN ('es', 'en', 'pt')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT DEFAULT 'silo' CHECK(type IN ('silo', 'category', 'tag')),
  description TEXT,
  pillar_article_slug TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, lang, type)
);

CREATE INDEX idx_categories_slug ON categories(slug, lang);

-- Content Categories
CREATE TABLE IF NOT EXISTS content_categories (
  content_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (content_id, category_id),
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Content Tags
CREATE TABLE IF NOT EXISTS content_tags (
  content_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (content_id, tag_id),
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Notifications Log
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('email', 'telegram', 'webhook')),
  channel TEXT,
  recipient TEXT,
  subject TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed')),
  sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Seed Categories (Silos)
INSERT OR IGNORE INTO categories (slug, lang, name, type) VALUES
('reviews', 'es', 'Reviews', 'silo'),
('tutorials', 'es', 'Tutoriales', 'silo'),
('courses', 'es', 'Cursos', 'silo'),
('gear', 'es', 'Equipos', 'silo'),
('streaming', 'es', 'Streaming', 'silo');

INSERT OR IGNORE INTO categories (slug, lang, name, type) VALUES
('reviews', 'en', 'Reviews', 'silo'),
('tutorials', 'en', 'Tutorials', 'silo'),
('courses', 'en', 'Courses', 'silo'),
('gear', 'en', 'Gear', 'silo'),
('streaming', 'en', 'Streaming', 'silo');

INSERT OR IGNORE INTO categories (slug, lang, name, type) VALUES
('reviews', 'pt', 'Reviews', 'silo'),
('tutorials', 'pt', 'Tutoriais', 'silo'),
('courses', 'pt', 'Cursos', 'silo'),
('gear', 'pt', 'Equipamentos', 'silo'),
('streaming', 'pt', 'Streaming', 'silo');

-- Sample Content
INSERT OR IGNORE INTO content (lang, type, title, slug, excerpt, body, status, seo_title, seo_description, published_at, author_name) VALUES
('es', 'article', 'Las Mejores Guitarras Eléctricas para Principiantes en 2025', 'mejores-guitarras-electricas-principiantes', '¿Buscas tu primera guitarra eléctrica? Aquí están las mejores opciones calidad-precio.', '<h2>Introducción</h2><p>Elegir tu primera guitarra eléctrica puede ser abrumador. Con tantas opciones en el mercado, es fácil sentirse perdido. En esta guía, te presentamos las mejores opciones para principiantes en 2025.</p><h2>Nuestras Mejores Picks</h2><p>Después de probar decenas de guitarras, estas son nuestras recomendaciones...</p>', 'published', 'Las 7 Mejores Guitarras Eléctricas para Principiantes 2025 | mp3', 'Descubre las mejores guitarras eléctricas para principiantes. Reviews completas, precios y recomendaciones de expertos.', '2025-01-15', 'mp3 Editorial'),

('en', 'article', 'Best Electric Guitars for Beginners 2025', 'best-electric-guitars-beginners', 'Looking for your first electric guitar? Here are the best value options.', '<h2>Introduction</h2><p>Choosing your first electric guitar can be overwhelming. With so many options on the market, it is easy to feel lost. In this guide, we present the best options for beginners in 2025.</p><h2>Our Top Picks</h2><p>After testing dozens of guitars, these are our recommendations...</p>', 'published', 'Best 7 Electric Guitars for Beginners 2025 | mp3', 'Discover the best electric guitars for beginners. Complete reviews, prices and expert recommendations.', '2025-01-15', 'mp3 Editorial'),

('pt', 'article', 'As Melhores Guitarras Elétricas para Iniciantes 2025', 'melhores-guitarras-eletricas-iniciantes', 'Procurando sua primeira guitarra elétrica? Aqui estão as melhores opções custo-benefício.', '<h2>Introdução</h2><p>Escolher sua primeira guitarra elétrica pode ser avassalador. Com tantas opções no mercado, é fácil ficar perdido. Neste guia, apresentamos as melhores opções para iniciantes em 2025.</p><h2>Nossas Melhores Escolhas</h2><p>Depois de testar dezenas de guitarras, estas são nossas recomendações...</p>', 'published', 'As 7 Melhores Guitarras Elétricas para Iniciantes 2025 | mp3', 'Descubra as melhores guitars elétricas para iniciantes. Reviews completas, preços e recomendações de especialistas.', '2025-01-15', 'mp3 Editorial'),

('es', 'article', 'Cómo Aprender a Tocar Guitarra en 30 Días', 'aprender-tocar-guitarra-30-dias', 'Un plan estructurado para aprender guitarra desde cero en un mes.', '<h2>Día 1-7: Fundamentos</h2><p>Los primeros días son cruciales. Enfócate en...</p><h2>Día 8-14: Acordes Básicos</h2><p>Ahora es momento de aprender los acordes fundamentales...</p>', 'published', 'Cómo Aprender a Tocar Guitarra en 30 Días | Guía Completa', 'Aprende a tocar guitarra con nuestro plan de 30 días. Ejercicios diarios, técnicas básicas y canciones para practicar.', '2025-01-20', 'mp3 Editorial'),

('en', 'article', 'How to Learn Guitar in 30 Days', 'learn-guitar-30-days', 'A structured plan to learn guitar from scratch in one month.', '<h2>Day 1-7: Fundamentals</h2><p>The first few days are crucial. Focus on...</p><h2>Day 8-14: Basic Chords</h2><p>Now it is time to learn the fundamental chords...</p>', 'published', 'How to Learn Guitar in 30 Days | Complete Guide', 'Learn to play guitar with our 30-day plan. Daily exercises, basic techniques and songs to practice.', '2025-01-20', 'mp3 Editorial'),

('pt', 'article', 'Como Aprender a Tocar Guitarra em 30 Dias', 'aprender-tocar-guitarra-30-dias', 'Um plano estruturado para aprender guitarra do zero em um mês.', '<h2>Dia 1-7: Fundamentos</h2><p>Os primeiros dias são cruciais. Foco em...</p><h2>Dia 8-14: Acordes Básicos</h2><p>Agora é hora de aprender os acordes fundamentais...</p>', 'published', 'Como Aprender a Tocar Guitarra em 30 Dias | Guia Completo', 'Aprenda a tocar guitarra com nosso plano de 30 dias. Exercícios diários, técnicas básicas e canções para praticar.', '2025-01-20', 'mp3 Editorial');

-- Seed Admin User
INSERT OR IGNORE INTO admin_users (email, password_hash, salt, role, is_active, created_at) VALUES 
('comprafacil@gmail.com', '61cab155e99e81d1d29fb26022c52883e690c4f5ca5a81e07db56f9416d3e0b90fbc0485134959dd8915fe5484ba4b3ee3ded3667dd722432a764cdfdca8c10b', '6cddbe1915886bd764c052bdc38d6baf', 'admin', 1, datetime('now'));
