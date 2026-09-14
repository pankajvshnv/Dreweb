-- ==========================================================
-- DREWEB - PostgreSQL Database Schema for Supabase
-- ==========================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client TEXT,
  industry TEXT,
  year TEXT,
  duration TEXT,
  shortDescription TEXT,
  challenge TEXT,
  solution TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  github TEXT,
  heroImage TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  heroVideo TEXT,
  isFeatured BOOLEAN DEFAULT false,
  isPublic BOOLEAN DEFAULT true,
  "order" INT DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  shortDescription TEXT,
  description TEXT,
  image TEXT,
  isPublished BOOLEAN DEFAULT true,
  "order" INT DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRICING TABLE
CREATE TABLE IF NOT EXISTS pricing (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  headline TEXT,
  price TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  nots JSONB DEFAULT '[]'::jsonb,
  isFeatured BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  cta TEXT,
  "order" INT DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BLOG TABLE
CREATE TABLE IF NOT EXISTS blog (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT,
  excerpt TEXT,
  content TEXT,
  coverImage TEXT,
  category TEXT,
  readTime TEXT,
  isPublished BOOLEAN DEFAULT true,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEADS TABLE (Contact Form Inquiries)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  company TEXT,
  service TEXT,
  currency TEXT DEFAULT '$',
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author TEXT NOT NULL,
  role TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  avatar TEXT,
  rating INT DEFAULT 5,
  isPublished BOOLEAN DEFAULT true,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SHOWCASE HERO CARDS TABLE
CREATE TABLE IF NOT EXISTS showcase_hero_cards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  imageUrl TEXT,
  width INT,
  height INT,
  initialX INT,
  initialY INT,
  rotation INT,
  floatSpeed NUMERIC,
  scale NUMERIC,
  zIndex INT,
  stats JSONB DEFAULT '{}'::jsonb,
  "order" INT DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ/WRITE POLICIES
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_hero_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public All Projects" ON projects FOR ALL USING (true);

CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public All Services" ON services FOR ALL USING (true);

CREATE POLICY "Public Read Pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Public All Pricing" ON pricing FOR ALL USING (true);

CREATE POLICY "Public Read Blog" ON blog FOR SELECT USING (true);
CREATE POLICY "Public All Blog" ON blog FOR ALL USING (true);

CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public All Leads" ON leads FOR ALL USING (true);

CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public All Testimonials" ON testimonials FOR ALL USING (true);

CREATE POLICY "Public Read Showcase" ON showcase_hero_cards FOR SELECT USING (true);
CREATE POLICY "Public All Showcase" ON showcase_hero_cards FOR ALL USING (true);

CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public All Settings" ON settings FOR ALL USING (true);
