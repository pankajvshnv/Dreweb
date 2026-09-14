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

// Helper for dynamic table querying
const allowedTables = ['projects', 'services', 'pricing', 'blog', 'leads', 'testimonials', 'showcase_hero_cards'];

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
    const result = await pool.query(`SELECT * FROM ${collection}`);
    // Map camelCase for frontend compatibility
    const items = result.rows.map(row => {
      const item = { ...row };
      if (row.short_description) item.shortDescription = row.short_description;
      if (row.hero_image) item.heroImage = row.hero_image;
      if (row.hero_video) item.heroVideo = row.hero_video;
      if (row.is_featured !== undefined) item.isFeatured = row.is_featured;
      if (row.is_public !== undefined) item.isPublic = row.is_public;
      if (row.is_published !== undefined) item.isPublished = row.is_published;
      if (row.is_active !== undefined) item.isActive = row.is_active;
      if (row.display_order !== undefined) item.order = row.display_order;
      if (row.created_at) item.createdAt = row.created_at;
      if (row.updated_at) item.updatedAt = row.updated_at;
      return item;
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE ITEM
app.post('/api/:collection', async (req, res) => {
  const { collection } = req.params;
  const data = req.body;
  const id = data.id || Date.now().toString();

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

  if (collection === 'leads') {
    try {
      await pool.query(
        `INSERT INTO leads (id, name, email, mobile, company, service, currency, budget, message, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          id,
          data.name,
          data.email,
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

  if (collection === 'projects') {
    try {
      await pool.query(
        `INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())`,
        [
          id,
          data.title,
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
          data.heroImage || '',
          JSON.stringify(data.gallery || []),
          data.heroVideo || '',
          data.isFeatured || false,
          data.isPublic !== false,
          data.order || 0,
        ]
      );
      return res.json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Generic JSON store fallback in settings table for custom collections
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

app.listen(PORT, () => {
  console.log(`🚀 Express API server running on port ${PORT}`);
});
