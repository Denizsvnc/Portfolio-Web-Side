import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { images } from '../../db/schema';
import type { CreateImageDTO, UpdateImageDTO } from './images.types';

export const createImageRecord = async (imageUrl: string, data: CreateImageDTO) => {
  const result = await db.insert(images).values({
    image_url: imageUrl,
    alt_text: data.alt_text || '',
    blogId: data.blogId ? data.blogId : null,
    queue: data.queue !== undefined ? Number(data.queue) : 0,
  }).returning();
  return result;
};

export const getAllImages = async () => {
  const result = await db.select().from(images);
  return result;
};

export const getImageById = async (id: string) => {
  const result = await db.select().from(images).where(eq(images.id, id));
  return result;
};

export const updateImageRecord = async (id: string, data: UpdateImageDTO) => {
  const result = await db.update(images).set(data).where(eq(images.id, id)).returning();
  return result;
};

export const deleteImageRecord = async (id: string) => {
  const result = await db.delete(images).where(eq(images.id, id)).returning();
  return result;
};
