import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function alterTable() {
  try {
    await pool.query(`ALTER TABLE blog ADD COLUMN IF NOT EXISTS featured_image_prompt TEXT;`);
    console.log('Successfully added featured_image_prompt column to blog table.');
  } catch (error) {
    console.error('Error altering table:', error.message);
  } finally {
    pool.end();
  }
}

alterTable();
