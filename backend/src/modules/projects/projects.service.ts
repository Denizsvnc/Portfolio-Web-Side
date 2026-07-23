import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { projects, projectAnalytics } from '../../db/schema';
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

export const shareProjectById = async (id: string, visitorId?: string, ipAddress?: string, city?: string, platform?: string) => {
    const updatedProject = await db.update(projects).set({ shares: sql`${projects.shares} + 1` }).where(eq(projects.id, id)).returning();
    
    if (updatedProject.length > 0) {
        await db.insert(projectAnalytics).values({
            project_id: id,
            visitor_id: visitorId || null,
            event_type: 'share',
            platform: platform || 'Unknown',
            ip_address: ipAddress || null,
            city: city || 'Unknown',
        });
    }

    return updatedProject;
};
