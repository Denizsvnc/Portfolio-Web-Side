import { db } from './index';
import { blogs, projects } from './schema';
import { eq } from 'drizzle-orm';

const slugify = (text: string) => {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    let str = text.trim().toLowerCase();
    
    // Convert Turkish characters
    for (let key in trMap) {
        str = str.replace(new RegExp(key, 'g'), trMap[key]);
    }
    
    // Remove non-alphanumeric characters, replace spaces with hyphens
    return str
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const generateUniqueSlug = async (baseSlug: string, table: any, existingId?: string) => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;
    
    while (!isUnique) {
        let existing;
        if (table === 'blogs') {
            const result = await db.select({ id: blogs.id }).from(blogs).where(eq(blogs.slug, slug));
            existing = result[0];
        } else {
            const result = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug));
            existing = result[0];
        }

        if (!existing || existing.id === existingId) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    
    return slug;
};

async function migrateSlugs() {
    console.log("Migrating blogs...");
    const allBlogs = await db.select().from(blogs);
    for (const blog of allBlogs) {
        if (!blog.slug) {
            const baseSlug = slugify(blog.title_tr || "blog-post");
            const slug = await generateUniqueSlug(baseSlug, 'blogs', blog.id);
            await db.update(blogs).set({ slug }).where(eq(blogs.id, blog.id));
            console.log(`Updated blog ${blog.id} with slug: ${slug}`);
        }
    }

    console.log("Migrating projects...");
    const allProjects = await db.select().from(projects);
    for (const project of allProjects) {
        if (!project.slug) {
            const baseSlug = slugify(project.title_tr || "project");
            const slug = await generateUniqueSlug(baseSlug, 'projects', project.id);
            await db.update(projects).set({ slug }).where(eq(projects.id, project.id));
            console.log(`Updated project ${project.id} with slug: ${slug}`);
        }
    }

    console.log("Migration completed!");
    process.exit(0);
}

migrateSlugs().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
