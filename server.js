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

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('⚠️ PostgreSQL Connection Failed:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL Database successfully!');
    try {
      await client.query('ALTER TABLE blog ADD COLUMN IF NOT EXISTS featured_image_prompt TEXT;');
      console.log('✅ Database migration successful: ensured featured_image_prompt exists.');
    } catch (e) {
      console.error('⚠️ Database migration failed:', e.message);
    }
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

// Helper function to map database snake_case to frontend camelCase
function mapRowToCamelCase(row) {
  if (!row) return null;
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
  if (row.featured_image_prompt !== undefined) item.featuredImagePrompt = row.featured_image_prompt;
  if (row.z_index !== undefined) item.zIndex = row.z_index;
  if (row.paypal_link !== undefined) item.paypalLink = row.paypal_link;
  if (row.upi_qr_code !== undefined) item.upiQrCode = row.upi_qr_code;
  if (row.upi_id !== undefined) item.upiId = row.upi_id;
  if (row.access_link !== undefined) item.accessLink = row.access_link;
  if (row.meta_title !== undefined) item.metaTitle = row.meta_title;
  if (row.meta_desc !== undefined) item.metaDesc = row.meta_desc;
  if (row.keywords !== undefined) item.keywords = row.keywords;
  if (row.download_url !== undefined) item.downloadUrl = row.download_url;
  if (row.live_demo_url !== undefined) item.liveDemoUrl = row.live_demo_url;
  if (row.thumbnail_url !== undefined) item.thumbnailUrl = row.thumbnail_url;
  if (row.avatar !== undefined) {
    item.avatar = row.avatar;
    item.authorImage = row.avatar;
  }
  if (row.created_at !== undefined) item.createdAt = row.created_at;
  if (row.updated_at !== undefined) item.updatedAt = row.updated_at;
  return item;
}

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
    const items = result.rows.map(row => mapRowToCamelCase(row));
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET SINGLE ITEM BY ID
app.get('/api/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  if (!allowedTables.includes(collection)) {
    return res.status(400).json({ error: 'Invalid collection' });
  }
  try {
    let query = `SELECT * FROM ${collection} WHERE id = $1`;
    if (collection === 'blog') {
      query = `SELECT * FROM ${collection} WHERE id = $1 OR slug = $1`;
    }
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(mapRowToCamelCase(result.rows[0]));
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
      const existing = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
      if (existing.rows.length > 0) {
        const cur = existing.rows[0];
        const title = data.title !== undefined ? data.title : cur.title;
        const slug = data.slug !== undefined ? data.slug : cur.slug;
        const client = data.client !== undefined ? data.client : cur.client;
        const industry = data.industry !== undefined ? data.industry : cur.industry;
        const year = data.year !== undefined ? data.year : cur.year;
        const duration = data.duration !== undefined ? data.duration : cur.duration;
        const shortDescription = data.shortDescription !== undefined ? data.shortDescription : (data.short_description !== undefined ? data.short_description : cur.short_description);
        const challenge = data.challenge !== undefined ? data.challenge : cur.challenge;
        const solution = data.solution !== undefined ? data.solution : cur.solution;
        const technologies = data.technologies !== undefined ? JSON.stringify(data.technologies) : (typeof cur.technologies === 'string' ? cur.technologies : JSON.stringify(cur.technologies || []));
        const link = data.link !== undefined ? data.link : cur.link;
        const github = data.github !== undefined ? data.github : cur.github;
        const heroImage = data.heroImage !== undefined ? data.heroImage : (data.hero_image !== undefined ? data.hero_image : cur.hero_image);
        const gallery = data.gallery !== undefined ? JSON.stringify(data.gallery) : (typeof cur.gallery === 'string' ? cur.gallery : JSON.stringify(cur.gallery || []));
        const heroVideo = data.heroVideo !== undefined ? data.heroVideo : (data.hero_video !== undefined ? data.hero_video : cur.hero_video);
        const isFeatured = data.isFeatured !== undefined ? data.isFeatured : (data.is_featured !== undefined ? data.is_featured : cur.is_featured);
        const isPublic = data.isPublic !== undefined ? data.isPublic : (data.is_public !== undefined ? data.is_public : cur.is_public);
        const displayOrder = data.order !== undefined ? data.order : (data.display_order !== undefined ? data.display_order : cur.display_order);
        const metaTitle = data.metaTitle !== undefined ? data.metaTitle : (data.meta_title !== undefined ? data.meta_title : cur.meta_title);
        const metaDesc = data.metaDesc !== undefined ? data.metaDesc : (data.meta_desc !== undefined ? data.meta_desc : cur.meta_desc);
        const keywords = data.keywords !== undefined ? data.keywords : cur.keywords;

        await pool.query(
          `UPDATE projects SET 
             title = $2, slug = $3, client = $4, industry = $5, year = $6, duration = $7,
             short_description = $8, challenge = $9, solution = $10, technologies = $11,
             link = $12, github = $13, hero_image = $14, gallery = $15, hero_video = $16,
             is_featured = $17, is_public = $18, display_order = $19, meta_title = $20,
             meta_desc = $21, keywords = $22, updated_at = NOW()
           WHERE id = $1`,
          [id, title, slug, client, industry, year, duration, shortDescription, challenge, solution, technologies, link, github, heroImage, gallery, heroVideo, isFeatured, isPublic, displayOrder, metaTitle, metaDesc, keywords]
        );
      } else {
        await pool.query(
          `INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order, meta_title, meta_desc, keywords, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW(), NOW())`,
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
            data.metaTitle || data.meta_title || '',
            data.metaDesc || data.meta_desc || '',
            data.keywords || '',
          ]
        );
      }
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
           title = CASE WHEN EXCLUDED.title <> '' THEN EXCLUDED.title ELSE services.title END,
           slug = CASE WHEN EXCLUDED.slug <> '' THEN EXCLUDED.slug ELSE services.slug END,
           category = CASE WHEN EXCLUDED.category <> '' THEN EXCLUDED.category ELSE services.category END,
           short_description = CASE WHEN EXCLUDED.short_description <> '' THEN EXCLUDED.short_description ELSE services.short_description END,
           description = CASE WHEN EXCLUDED.description <> '' THEN EXCLUDED.description ELSE services.description END,
           image = CASE WHEN EXCLUDED.image <> '' THEN EXCLUDED.image ELSE services.image END,
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
           name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE pricing.name END,
           headline = CASE WHEN EXCLUDED.headline <> '' THEN EXCLUDED.headline ELSE pricing.headline END,
           price = CASE WHEN EXCLUDED.price <> '' THEN EXCLUDED.price ELSE pricing.price END,
           description = CASE WHEN EXCLUDED.description <> '' THEN EXCLUDED.description ELSE pricing.description END,
           features = CASE WHEN EXCLUDED.features::text <> '[]' THEN EXCLUDED.features ELSE pricing.features END,
           nots = CASE WHEN EXCLUDED.nots::text <> '[]' THEN EXCLUDED.nots ELSE pricing.nots END,
           is_featured = EXCLUDED.is_featured,
           is_active = EXCLUDED.is_active,
           cta = CASE WHEN EXCLUDED.cta <> '' THEN EXCLUDED.cta ELSE pricing.cta END,
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
        `INSERT INTO blog (id, title, slug, author, excerpt, content, cover_image, category, read_time, featured_image_prompt, is_published, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = CASE WHEN EXCLUDED.title <> '' THEN EXCLUDED.title ELSE blog.title END,
           slug = CASE WHEN EXCLUDED.slug <> '' THEN EXCLUDED.slug ELSE blog.slug END,
           author = CASE WHEN EXCLUDED.author <> '' THEN EXCLUDED.author ELSE blog.author END,
           excerpt = CASE WHEN EXCLUDED.excerpt <> '' THEN EXCLUDED.excerpt ELSE blog.excerpt END,
           content = CASE WHEN EXCLUDED.content <> '' THEN EXCLUDED.content ELSE blog.content END,
           cover_image = CASE WHEN EXCLUDED.cover_image <> '' THEN EXCLUDED.cover_image ELSE blog.cover_image END,
           category = CASE WHEN EXCLUDED.category <> '' THEN EXCLUDED.category ELSE blog.category END,
           read_time = CASE WHEN EXCLUDED.read_time <> '' THEN EXCLUDED.read_time ELSE blog.read_time END,
           featured_image_prompt = CASE WHEN EXCLUDED.featured_image_prompt <> '' THEN EXCLUDED.featured_image_prompt ELSE blog.featured_image_prompt END,
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
          data.featuredImagePrompt || data.featured_image_prompt || '',
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
           author = CASE WHEN EXCLUDED.author <> '' THEN EXCLUDED.author ELSE testimonials.author END,
           role = CASE WHEN EXCLUDED.role <> '' THEN EXCLUDED.role ELSE testimonials.role END,
           company = CASE WHEN EXCLUDED.company <> '' THEN EXCLUDED.company ELSE testimonials.company END,
           quote = CASE WHEN EXCLUDED.quote <> '' THEN EXCLUDED.quote ELSE testimonials.quote END,
           avatar = CASE WHEN EXCLUDED.avatar <> '' THEN EXCLUDED.avatar ELSE testimonials.avatar END,
           rating = EXCLUDED.rating,
           is_published = EXCLUDED.is_published,
           updated_at = NOW()`,
        [
          id,
          data.author || '',
          data.role || '',
          data.company || '',
          data.quote || '',
          data.avatar || data.authorImage || '',
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
           title = CASE WHEN EXCLUDED.title <> '' THEN EXCLUDED.title ELSE templates.title END,
           category = CASE WHEN EXCLUDED.category <> '' THEN EXCLUDED.category ELSE templates.category END,
           price = CASE WHEN EXCLUDED.price <> '' THEN EXCLUDED.price ELSE templates.price END,
           currency = CASE WHEN EXCLUDED.currency <> '' THEN EXCLUDED.currency ELSE templates.currency END,
           description = CASE WHEN EXCLUDED.description <> '' THEN EXCLUDED.description ELSE templates.description END,
           hero_image = CASE WHEN EXCLUDED.hero_image <> '' THEN EXCLUDED.hero_image ELSE templates.hero_image END,
           paypal_link = CASE WHEN EXCLUDED.paypal_link <> '' THEN EXCLUDED.paypal_link ELSE templates.paypal_link END,
           upi_qr_code = CASE WHEN EXCLUDED.upi_qr_code <> '' THEN EXCLUDED.upi_qr_code ELSE templates.upi_qr_code END,
           upi_id = CASE WHEN EXCLUDED.upi_id <> '' THEN EXCLUDED.upi_id ELSE templates.upi_id END,
           access_link = CASE WHEN EXCLUDED.access_link <> '' THEN EXCLUDED.access_link ELSE templates.access_link END,
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


