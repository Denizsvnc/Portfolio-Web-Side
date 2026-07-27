import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { blogs, blogAnalytics } from '../../db/schema';
import type { createBlogDTO, updateBlogDTO } from './blogs.types';

const slugify = (text: string) => {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    let str = text.trim().toLowerCase();
    for (let key in trMap) {
        str = str.replace(new RegExp(key, 'g'), trMap[key] as string);
    }
    return str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

const generateUniqueSlug = async (baseSlug: string, existingId?: string) => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;
    
    while (!isUnique) {
        const result = await db.select({ id: blogs.id }).from(blogs).where(eq(blogs.slug, slug));
        const existing = result[0];
        
        if (!existing || existing.id === existingId) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    return slug;
};

export const createBlog = async (data: createBlogDTO) => {
  const baseSlug = slugify(data.title_tr || "blog-post");
  const slug = await generateUniqueSlug(baseSlug);

  const result = await db.insert(blogs).values({
    slug,
    icon: data.icon,
    img_url: data.img_url,
    title_tr: data.title_tr,
    title_en: data.title_en,
    title_de: data.title_de,
    title_ru: data.title_ru,
    description_tr: data.description_tr,
    description_en: data.description_en,
    description_de: data.description_de,
    description_ru: data.description_ru,
    attachments: data.attachments || [],
    links: data.links || [],
    queue: data.queue !== undefined ? Number(data.queue) : 0,
    isActive: data.isActive !== undefined ? data.isActive : true,
  }).returning();
  return result;
};

export const getAllBlogs = async () => {
  const result = await db.select().from(blogs);
  return result;
};

export const getBlogById = async (identifier: string, visitorId?: string, ipAddress?: string, city?: string) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
  
  // First, find the real ID if it's a slug
  let blogId = identifier;
  if (!isUuid) {
    const found = await db.select({ id: blogs.id }).from(blogs).where(eq(blogs.slug, identifier));
    if (!found || found.length === 0) return [];
    blogId = found[0]!.id;
  }

  await db.update(blogs).set({ views: sql`${blogs.views} + 1` }).where(eq(blogs.id, blogId));
  
  await db.insert(blogAnalytics).values({
    blog_id: blogId,
    visitor_id: visitorId || null,
    event_type: 'read',
    ip_address: ipAddress || null,
    city: city || 'Unknown',
  });

  const result = await db.select().from(blogs).where(eq(blogs.id, blogId));
  return result;
};

export const shareBlogById = async (id: string, visitorId?: string, ipAddress?: string, city?: string, platform?: string) => {
  const updatedBlog = await db.update(blogs).set({ shares: sql`${blogs.shares} + 1` }).where(eq(blogs.id, id)).returning();
  
  if (updatedBlog.length > 0) {
    await db.insert(blogAnalytics).values({
      blog_id: id,
      visitor_id: visitorId || null,
      event_type: 'share',
      platform: platform || 'Unknown',
      ip_address: ipAddress || null,
      city: city || 'Unknown',
    });
  }

  return updatedBlog;
};

export const updateBlog = async (id: string, data: updateBlogDTO) => {
  let slug = (data as any).slug as string | undefined;
  if (data.title_tr) {
    const baseSlug = slugify(data.title_tr);
    slug = await generateUniqueSlug(baseSlug, id);
  }

  const updateData = slug ? { ...data, slug } : data;
  const result = await db.update(blogs).set(updateData).where(eq(blogs.id, id)).returning();
  return result;
};

export const deleteBlog = async (id: string) => {
  const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
  return result;
};
