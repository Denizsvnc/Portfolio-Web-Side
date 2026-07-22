import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { about } from '../../db/schema';
import type { createAboutSection, updateAboutSection, getAboutSection, deleteAboutSection } from './about.types';

export const createAbout = async (data: createAboutSection) => {
  const result = await db.insert(about).values(data).returning();
  return result;
};

export const updateAbout = async (id: string, data: updateAboutSection) => {
  const result = await db.update(about).set(data).where(eq(about.id, id)).returning();
  return result;
};

export const getAllAbout = async () => {
  const result = await db.select().from(about);
  return result;
};

export const getAbout = async (data: getAboutSection) => {
  const result = await db.select().from(about).where(eq(about.id, data.id));
  return result;
};

export const deleteAbout = async (data: deleteAboutSection) => {
  const result = await db.delete(about).where(eq(about.id, data.id)).returning();
  return result;
};