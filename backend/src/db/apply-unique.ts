import { db } from './index';
import { sql } from 'drizzle-orm';

async function applyUnique() {
    try {
        console.log("Applying unique constraints...");
        await db.execute(sql`ALTER TABLE "blogs" ADD CONSTRAINT "blogs_slug_unique" UNIQUE("slug");`);
        await db.execute(sql`ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_unique" UNIQUE("slug");`);
        console.log("Constraints applied successfully!");
    } catch (e: any) {
        if (e.message.includes('already exists')) {
            console.log("Constraints already exist.");
        } else {
            console.error("Failed to apply constraints:", e);
        }
    }
    process.exit(0);
}

applyUnique();
