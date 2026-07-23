import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { projects } from '../../db/schema';
import type { createProjects, updateProjects, getProjects, deleteProjects } from './projects.types';

export const createProject = async (data: createProjects) => {
    const result = await db.insert(projects).values(data).returning();
    return result;
}

export const updateProject = async (data: updateProjects) => {
    const result = await db.update(projects).set(data).where(eq(projects.id, data.id)).returning();
    return result;
}

export const getProject = async (data: getProjects) => {
    const result = await db.select().from(projects).where(eq(projects.id, data.id));
    return result;
}

export const getAllProjects = async () => {
    const result = await db.select().from(projects);
    return result;
}

export const deleteProject = async (data: deleteProjects) => {
    const result = await db.delete(projects).where(eq(projects.id, data.id)).returning();
    return result;
}
