import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { skilss } from '../../db/schema';
import type { createSkilss, updateSkilss, getSkilss, deleteSkilss } from './skilss.types';

export const createSkill = async (data: createSkilss) => {
    const result = await db.insert(skilss).values(data).returning();
    return result;
}

export const updateSkill = async (id: string, data: updateSkilss) => {
    const result = await db.update(skilss).set(data).where(eq(skilss.id, id)).returning();
    return result;
}

export const getAllSkills = async () => {
    const result = await db.select().from(skilss);
    return result;
}

export const getSkill = async (data: getSkilss) => {
    const result = await db.select().from(skilss).where(eq(skilss.id, data.id));
    return result;
}

export const deleteSkill = async (data: deleteSkilss) => {
    const result = await db.delete(skilss).where(eq(skilss.id, data.id)).returning();
    return result;
}