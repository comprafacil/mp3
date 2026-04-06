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

-- Seed Silos
INSERT OR IGNORE INTO silos (slug, name_es, name_en, name_pt, description_es, description_en, description_pt) VALUES
('reviews', 'Reviews', 'Reviews', 'Reviews', 'Análisis profundos de instrumentos y equipos de música', 'In-depth analysis of music instruments and equipment', 'Análise profunda de instrumentos e equipamentos de música'),
('tutorials', 'Tutoriales', 'Tutorials', 'Tutoriais', 'Aprende a tocar, producir y más con nuestros tutoriales', 'Learn to play, produce and more with our tutorials', 'Aprenda a tocar, produzir e mais com nossos tutoriais'),
('courses', 'Cursos', 'Courses', 'Cursos', 'Cursos completos de música y producción', 'Complete music and production courses', 'Cursos completos de música e produção'),
('gear', 'Equipos', 'Gear', 'Equipamentos', 'Reviews y guías de equipos de estudio', 'Studio gear reviews and guides', 'Reviews e guias de equipamentos de estúdio'),
('streaming', 'Streaming', 'Streaming', 'Streaming', 'Todo sobre streaming de música y plataformas', 'Everything about music streaming and platforms', 'Tudo sobre streaming de música e plataformas');

-- Sample Articles
INSERT OR IGNORE INTO articles (title, slug, lang, silo_slug, meta_title, meta_description, excerpt, content, status, word_count, read_time, published_at, author_name) VALUES
('Las Mejores Guitarras Eléctricas para Principiantes en 2025', 'mejores-guitarras-electricas-principiantes', 'es', 'reviews', 'Las 7 Mejores Guitarras Eléctricas para Principiantes 2025 | mp3', 'Descubre las mejores guitarras eléctricas para principiantes. Reviews completas, precios y recomendaciones de expertos.', '¿Buscas tu primera guitarra eléctrica? Aquí están las mejores opciones calidad-precio.', '<h2>Introducción</h2><p>Elegir tu primera guitarra eléctrica puede ser abrumador. Con tantas opciones en el mercado, es fácil sentirse perdido. En esta guía, te presentamos las mejores opciones para principiantes en 2025.</p><h2>Nuestras Mejores Picks</h2><p>Después de probar decenas de guitarras, estas son nuestras recomendaciones...</p>', 'published', 2500, 10, '2025-01-15', 'mp3 Editorial'),

('Best Electric Guitars for Beginners 2025', 'best-electric-guitars-beginners', 'en', 'reviews', 'Best 7 Electric Guitars for Beginners 2025 | mp3', 'Discover the best electric guitars for beginners. Complete reviews, prices and expert recommendations.', 'Looking for your first electric guitar? Here are the best value options.', '<h2>Introduction</h2><p>Choosing your first electric guitar can be overwhelming. With so many options on the market, it is easy to feel lost. In this guide, we present the best options for beginners in 2025.</p><h2>Our Top Picks</h2><p>After testing dozens of guitars, these are our recommendations...</p>', 'published', 2500, 10, '2025-01-15', 'mp3 Editorial'),

('As Melhores Guitarras Elétricas para Iniciantes 2025', 'melhores-guitarras-eletricas-iniciantes', 'pt', 'reviews', 'As 7 Melhores Guitarras Elétricas para Iniciantes 2025 | mp3', 'Descubra as melhores guitars elétricas para iniciantes. Reviews completas, preços e recomendações de especialistas.', 'Procurando sua primeira guitarra elétrica? Aqui estão as melhores opções custo-benefício.', '<h2>Introdução</h2><p>Escolher sua primeira guitarra elétrica pode ser avassalador. Com tantas opções no mercado, é fácil ficar perdido. Neste guia, apresentamos as melhores opções para iniciantes em 2025.</p><h2>Nossas Melhores Escolhas</h2><p>Depois de testar dezenas de guitarras, estas são nossas recomendações...</p>', 'published', 2500, 10, '2025-01-15', 'mp3 Editorial'),

('Cómo Aprender a Tocar Guitarra en 30 Días', 'aprender-tocar-guitarra-30-dias', 'es', 'tutorials', 'Cómo Aprender a Tocar Guitarra en 30 Días | Guía Completa', 'Aprende a tocar guitarra con nuestro plan de 30 días. Ejercicios diarios, técnicas básicas y canciones para practicar.', 'Un plan estructurado para aprender guitarra desde cero en un mes.', '<h2>Día 1-7: Fundamentos</h2><p>Los primeros días son cruciales. Enfócate en...</p><h2>Día 8-14: Acordes Básicos</h2><p>Ahora es momento de aprender los acordes fundamentales...</p>', 'published', 1800, 8, '2025-01-20', 'mp3 Editorial'),

('How to Learn Guitar in 30 Days', 'learn-guitar-30-days', 'en', 'tutorials', 'How to Learn Guitar in 30 Days | Complete Guide', 'Learn to play guitar with our 30-day plan. Daily exercises, basic techniques and songs to practice.', 'A structured plan to learn guitar from scratch in one month.', '<h2>Day 1-7: Fundamentals</h2><p>The first few days are crucial. Focus on...</p><h2>Day 8-14: Basic Chords</h2><p>Now it is time to learn the fundamental chords...</p>', 'published', 1800, 8, '2025-01-20', 'mp3 Editorial'),

('Como Aprender a Tocar Guitarra em 30 Dias', 'aprender-tocar-guitarra-30-dias', 'pt', 'tutorials', 'Como Aprender a Tocar Guitarra em 30 Dias | Guia Completo', 'Aprenda a tocar guitarra com nosso plano de 30 dias. Exercícios diários, técnicas básicas e canções para praticar.', 'Um plano estruturado para aprender guitarra do zero em um mês.', '<h2>Dia 1-7: Fundamentos</h2><p>Os primeiros dias são cruciais. Foco em...</p><h2>Dia 8-14: Acordes Básicos</h2><p>Agora é hora de aprender os acordes fundamentais...</p>', 'published', 1800, 8, '2025-01-20', 'mp3 Editorial');
