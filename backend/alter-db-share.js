import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    // 1. Add platform column to blog_analytics
    await pool.query(`
      ALTER TABLE "blog_analytics" ADD COLUMN IF NOT EXISTS "platform" varchar(50);
    `);

    // 2. Add shares column to projects
    await pool.query(`
      ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "shares" integer NOT NULL DEFAULT 0;
    `);

    // 3. Create project_analytics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "project_analytics" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
        "visitor_id" uuid REFERENCES "visitors"("id") ON DELETE SET NULL,
        "event_type" varchar(50) NOT NULL,
        "platform" varchar(50),
        "ip_address" varchar(45),
        "city" varchar(100) DEFAULT 'Unknown',
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
