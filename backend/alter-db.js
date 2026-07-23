import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      ALTER TABLE "blogs" DROP COLUMN IF EXISTS "attachment_url";
      ALTER TABLE "blogs" DROP COLUMN IF EXISTS "source_url";
      ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "attachments" jsonb NOT NULL DEFAULT '[]'::jsonb;
      ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "links" jsonb NOT NULL DEFAULT '[]'::jsonb;
    `);
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
