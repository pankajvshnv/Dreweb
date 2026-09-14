-- ==========================================================
-- DREWEB - PostgreSQL Database Schema for VPS
-- ==========================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  client VARCHAR(255),
  industry VARCHAR(255),
  year VARCHAR(50),
  duration VARCHAR(100),
  short_description TEXT,
  challenge TEXT,
  solution TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  github TEXT,
  hero_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  hero_video TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255),
  short_description TEXT,
  description TEXT,
  image TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRICING TABLE
CREATE TABLE IF NOT EXISTS pricing (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  headline VARCHAR(255),
  price VARCHAR(100) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  nots JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  cta VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BLOG TABLE
CREATE TABLE IF NOT EXISTS blog (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(255),
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category VARCHAR(255),
  read_time VARCHAR(100),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LEADS TABLE (Contact Inquiries)
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(100),
  company VARCHAR(255),
  service VARCHAR(255),
  currency VARCHAR(10) DEFAULT '$',
  budget VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(64) PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  company VARCHAR(255),
  quote TEXT NOT NULL,
  avatar TEXT,
  rating INT DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SHOWCASE HERO CARDS TABLE
CREATE TABLE IF NOT EXISTS showcase_hero_cards (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  image_url TEXT,
  width INT,
  height INT,
  initial_x INT,
  initial_y INT,
  rotation INT,
  float_speed NUMERIC,
  scale NUMERIC,
  z_index INT,
  stats JSONB DEFAULT '{}'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
