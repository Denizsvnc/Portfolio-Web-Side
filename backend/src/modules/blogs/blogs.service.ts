import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { blogs, blogAnalytics } from '../../db/schema';
import type { createBlogDTO, updateBlogDTO } from './blogs.types';

export const createBlog = async (data: createBlogDTO) => {
  const result = await db.insert(blogs).values({
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
    queue: data.queue !== undefined ? Number(data.queue) : 0,
    isActive: data.isActive !== undefined ? data.isActive : true,
  }).returning();
  return result;
};

export const getAllBlogs = async () => {
  const result = await db.select().from(blogs);
  return result;
};

export const getBlogById = async (id: string, visitorId?: string, ipAddress?: string, city?: string) => {
  await db.update(blogs).set({ views: sql`${blogs.views} + 1` }).where(eq(blogs.id, id));
  
  await db.insert(blogAnalytics).values({
    blog_id: id,
    visitor_id: visitorId || null,
    event_type: 'read',
    ip_address: ipAddress || null,
    city: city || 'Unknown',
  });

  const result = await db.select().from(blogs).where(eq(blogs.id, id));
  return result;
};

export const shareBlogById = async (id: string, visitorId?: string, ipAddress?: string, city?: string) => {
  const updatedBlog = await db.update(blogs).set({ shares: sql`${blogs.shares} + 1` }).where(eq(blogs.id, id)).returning();
  
  if (updatedBlog.length > 0) {
    await db.insert(blogAnalytics).values({
      blog_id: id,
      visitor_id: visitorId || null,
      event_type: 'share',
      ip_address: ipAddress || null,
      city: city || 'Unknown',
    });
  }

  return updatedBlog;
};

export const updateBlog = async (id: string, data: updateBlogDTO) => {
  const result = await db.update(blogs).set(data).where(eq(blogs.id, id)).returning();
  return result;
};

export const deleteBlog = async (id: string) => {
  const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
  return result;
};
