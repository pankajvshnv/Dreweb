import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ----------------------------------------------------
// POSTGRESQL CONNECTION POOL
// ----------------------------------------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dreweb',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('⚠️ PostgreSQL Connection Failed:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL Database successfully!');
    release();
  }
});

// Multer Storage Setup for Uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`);
  }
});
const upload = multer({ storage });

// Media Upload API Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// Admin Authentication Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Helper for dynamic table querying
const allowedTables = [
  'projects',
  'services',
  'pricing',
  'blog',
  'leads',
  'testimonials',
  'showcase_hero_cards',
  'templates',
  'media',
  'users'
];

// GET ALL ITEMS
app.get('/api/:collection', async (req, res) => {
  const { collection } = req.params;

  if (collection.startsWith('settings_')) {
    const key = collection.replace('settings_', '');
    try {
      const result = await pool.query('SELECT data FROM settings WHERE key = $1', [key]);
      return res.json(result.rows[0] ? result.rows[0].data : {});
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (!allowedTables.includes(collection)) {
    return res.status(400).json({ error: 'Invalid collection' });
  }

  try {
    const result = await pool.query(`SELECT * FROM ${collection} ORDER BY created_at DESC`);
    // Map camelCase for frontend compatibility
    const items = result.rows.map(row => {
      const item = { ...row };
      if (row.short_description !== undefined) item.shortDescription = row.short_description;
      if (row.hero_image !== undefined) item.heroImage = row.hero_image;
      if (row.hero_video !== undefined) item.heroVideo = row.hero_video;
      if (row.is_featured !== undefined) item.isFeatured = row.is_featured;
      if (row.is_public !== undefined) item.isPublic = row.is_public;
      if (row.is_published !== undefined) item.isPublished = row.is_published;
      if (row.is_active !== undefined) item.isActive = row.is_active;
      if (row.display_order !== undefined) item.order = row.display_order;
      if (row.cover_image !== undefined) item.coverImage = row.cover_image;
      if (row.read_time !== undefined) item.readTime = row.read_time;
      if (row.image_url !== undefined) item.imageUrl = row.image_url;
      if (row.initial_x !== undefined) item.initialX = row.initial_x;
      if (row.initial_y !== undefined) item.initialY = row.initial_y;
      if (row.float_speed !== undefined) item.floatSpeed = row.float_speed;
      if (row.z_index !== undefined) item.zIndex = row.z_index;
      if (row.paypal_link !== undefined) item.paypalLink = row.paypal_link;
      if (row.upi_qr_code !== undefined) item.upiQrCode = row.upi_qr_code;
      if (row.upi_id !== undefined) item.upiId = row.upi_id;
      if (row.access_link !== undefined) item.accessLink = row.access_link;
      if (row.created_at !== undefined) item.createdAt = row.created_at;
      if (row.updated_at !== undefined) item.updatedAt = row.updated_at;
      return item;
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE OR UPDATE ITEM (UPSERT)
app.post('/api/:collection', async (req, res) => {
  const { collection } = req.params;
  const data = req.body;
  const id = data.id || Date.now().toString();

  // Settings
  if (collection.startsWith('settings_')) {
    const key = collection.replace('settings_', '');
    try {
      await pool.query(
        'INSERT INTO settings (key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()',
        [key, JSON.stringify(data)]
      );
      return res.json({ success: true, id: key });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Leads
  if (collection === 'leads') {
    try {
      await pool.query(
        `INSERT INTO leads (id, name, email, mobile, company, service, currency, budget, message, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE leads.name END,
           email = CASE WHEN EXCLUDED.email <> '' THEN EXCLUDED.email ELSE leads.email END,
           mobile = CASE WHEN EXCLUDED.mobile <> '' THEN EXCLUDED.mobile ELSE leads.mobile END,
           company = CASE WHEN EXCLUDED.company <> '' THEN EXCLUDED.company ELSE leads.company END,
           service = CASE WHEN EXCLUDED.service <> '' THEN EXCLUDED.service ELSE leads.service END,
           currency = CASE WHEN EXCLUDED.currency <> '' THEN EXCLUDED.currency ELSE leads.currency END,
           budget = CASE WHEN EXCLUDED.budget <> '' THEN EXCLUDED.budget ELSE leads.budget END,
           message = CASE WHEN EXCLUDED.message <> '' THEN EXCLUDED.message ELSE leads.message END,
           status = CASE WHEN EXCLUDED.status <> '' THEN EXCLUDED.status ELSE leads.status END,
           updated_at = NOW()`,
        [
          id,
          data.name || '',
          data.email || '',
          data.mobile || '',
          data.company || '',
          data.service || '',
          data.currency || '$',
          data.budget || '',
          data.message || '',
          data.status || 'new',
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Projects
  if (collection === 'projects') {
    try {
      await pool.query(
        `INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           slug = EXCLUDED.slug,
           client = EXCLUDED.client,
           industry = EXCLUDED.industry,
           year = EXCLUDED.year,
           duration = EXCLUDED.duration,
           short_description = EXCLUDED.short_description,
           challenge = EXCLUDED.challenge,
           solution = EXCLUDED.solution,
           technologies = EXCLUDED.technologies,
           link = EXCLUDED.link,
           github = EXCLUDED.github,
           hero_image = EXCLUDED.hero_image,
           gallery = EXCLUDED.gallery,
           hero_video = EXCLUDED.hero_video,
           is_featured = EXCLUDED.is_featured,
           is_public = EXCLUDED.is_public,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()`,
        [
          id,
          data.title || '',
          data.slug || id,
          data.client || '',
          data.industry || '',
          data.year || '',
          data.duration || '',
          data.shortDescription || data.short_description || '',
          data.challenge || '',
          data.solution || '',
          JSON.stringify(data.technologies || []),
          data.link || '',
          data.github || '',
          data.heroImage || data.hero_image || '',
          JSON.stringify(data.gallery || []),
          data.heroVideo || data.hero_video || '',
          data.isFeatured !== undefined ? data.isFeatured : (data.is_featured || false),
          data.isPublic !== undefined ? data.isPublic : (data.is_public !== false),
          data.order !== undefined ? data.order : (data.display_order || 0),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Services
  if (collection === 'services') {
    try {
      await pool.query(
        `INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           slug = EXCLUDED.slug,
           category = EXCLUDED.category,
           short_description = EXCLUDED.short_description,
           description = EXCLUDED.description,
           image = EXCLUDED.image,
           is_published = EXCLUDED.is_published,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()`,
        [
          id,
          data.title || '',
          data.slug || id,
          data.category || '',
          data.shortDescription || data.short_description || '',
          data.description || '',
          data.image || '',
          data.isPublished !== undefined ? data.isPublished : (data.is_published !== false),
          data.order !== undefined ? data.order : (data.display_order || 0),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Pricing
  if (collection === 'pricing') {
    try {
      await pool.query(
        `INSERT INTO pricing (id, name, headline, price, description, features, nots, is_featured, is_active, cta, display_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           headline = EXCLUDED.headline,
           price = EXCLUDED.price,
           description = EXCLUDED.description,
           features = EXCLUDED.features,
           nots = EXCLUDED.nots,
           is_featured = EXCLUDED.is_featured,
           is_active = EXCLUDED.is_active,
           cta = EXCLUDED.cta,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()`,
        [
          id,
          data.name || '',
          data.headline || '',
          data.price || '',
          data.description || '',
          JSON.stringify(data.features || []),
          JSON.stringify(data.nots || []),
          data.isFeatured !== undefined ? data.isFeatured : (data.is_featured || false),
          data.isActive !== undefined ? data.isActive : (data.is_active !== false),
          data.cta || '',
          data.order !== undefined ? data.order : (data.display_order || 0),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Blog
  if (collection === 'blog') {
    try {
      await pool.query(
        `INSERT INTO blog (id, title, slug, author, excerpt, content, cover_image, category, read_time, is_published, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           slug = EXCLUDED.slug,
           author = EXCLUDED.author,
           excerpt = EXCLUDED.excerpt,
           content = EXCLUDED.content,
           cover_image = EXCLUDED.cover_image,
           category = EXCLUDED.category,
           read_time = EXCLUDED.read_time,
           is_published = EXCLUDED.is_published,
           updated_at = NOW()`,
        [
          id,
          data.title || '',
          data.slug || id,
          data.author || 'Admin',
          data.excerpt || '',
          data.content || '',
          data.coverImage || data.cover_image || '',
          data.category || '',
          data.readTime || data.read_time || '',
          data.isPublished !== undefined ? data.isPublished : (data.is_published !== false),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Testimonials
  if (collection === 'testimonials') {
    try {
      await pool.query(
        `INSERT INTO testimonials (id, author, role, company, quote, avatar, rating, is_published, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           author = EXCLUDED.author,
           role = EXCLUDED.role,
           company = EXCLUDED.company,
           quote = EXCLUDED.quote,
           avatar = EXCLUDED.avatar,
           rating = EXCLUDED.rating,
           is_published = EXCLUDED.is_published,
           updated_at = NOW()`,
        [
          id,
          data.author || '',
          data.role || '',
          data.company || '',
          data.quote || '',
          data.avatar || '',
          data.rating || 5,
          data.isPublished !== undefined ? data.isPublished : (data.is_published !== false),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Showcase Hero Cards
  if (collection === 'showcase_hero_cards') {
    try {
      await pool.query(
        `INSERT INTO showcase_hero_cards (id, type, title, subtitle, image_url, width, height, initial_x, initial_y, rotation, float_speed, scale, z_index, stats, display_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           type = EXCLUDED.type,
           title = EXCLUDED.title,
           subtitle = EXCLUDED.subtitle,
           image_url = EXCLUDED.image_url,
           width = EXCLUDED.width,
           height = EXCLUDED.height,
           initial_x = EXCLUDED.initial_x,
           initial_y = EXCLUDED.initial_y,
           rotation = EXCLUDED.rotation,
           float_speed = EXCLUDED.float_speed,
           scale = EXCLUDED.scale,
           z_index = EXCLUDED.z_index,
           stats = EXCLUDED.stats,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()`,
        [
          id,
          data.type || 'card',
          data.title || '',
          data.subtitle || '',
          data.imageUrl || data.image_url || '',
          data.width || 300,
          data.height || 200,
          data.initialX || data.initial_x || 0,
          data.initialY || data.initial_y || 0,
          data.rotation || 0,
          data.floatSpeed || data.float_speed || 1,
          data.scale || 1,
          data.zIndex || data.z_index || 1,
          JSON.stringify(data.stats || {}),
          data.order !== undefined ? data.order : (data.display_order || 0),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Templates (Shop)
  if (collection === 'templates') {
    try {
      await pool.query(
        `INSERT INTO templates (id, title, category, price, currency, description, hero_image, paypal_link, upi_qr_code, upi_id, access_link, is_public, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           price = EXCLUDED.price,
           currency = EXCLUDED.currency,
           description = EXCLUDED.description,
           hero_image = EXCLUDED.hero_image,
           paypal_link = EXCLUDED.paypal_link,
           upi_qr_code = EXCLUDED.upi_qr_code,
           upi_id = EXCLUDED.upi_id,
           access_link = EXCLUDED.access_link,
           is_public = EXCLUDED.is_public,
           updated_at = NOW()`,
        [
          id,
          data.title || '',
          data.category || '',
          data.price || '',
          data.currency || 'USD',
          data.description || '',
          data.heroImage || data.hero_image || '',
          data.paypalLink || data.paypal_link || '',
          data.upiQrCode || data.upi_qr_code || '',
          data.upiId || data.upi_id || '',
          data.accessLink || data.access_link || '',
          data.isPublic !== undefined ? data.isPublic : (data.is_public !== false),
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Media
  if (collection === 'media') {
    try {
      await pool.query(
        `INSERT INTO media (id, name, type, size, url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           type = EXCLUDED.type,
           size = EXCLUDED.size,
           url = EXCLUDED.url,
           updated_at = NOW()`,
        [
          id,
          data.name || '',
          data.type || '',
          data.size || '',
          data.url || '',
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Generic fallback for any other custom collection
  try {
    const jsonStr = JSON.stringify(data);
    await pool.query(
      'INSERT INTO settings (key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()',
      [`item_${collection}_${id}`, jsonStr]
    );
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE ITEM
app.delete('/api/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  if (!allowedTables.includes(collection)) {
    return res.status(400).json({ error: 'Invalid collection' });
  }
  try {
    await pool.query(`DELETE FROM ${collection} WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve static React frontend in production
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distDir, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Express API server running on port ${PORT}`);
});


