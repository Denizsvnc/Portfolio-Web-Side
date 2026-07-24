import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { projects, projectAnalytics } from '../../db/schema';
import type { createProjects, updateProjects, getProjects, deleteProjects } from './projects.types';

const slugify = (text: string) => {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    let str = text.trim().toLowerCase();
    for (let key in trMap) {
        str = str.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

const generateUniqueSlug = async (baseSlug: string, existingId?: string) => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;
    
    while (!isUnique) {
        const result = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug));
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

export const createProject = async (data: createProjects) => {
    const baseSlug = slugify(data.title_tr || "project");
    const slug = await generateUniqueSlug(baseSlug);
    
    const result = await db.insert(projects).values({ ...data, slug }).returning();
    return result;
}

export const updateProject = async (data: updateProjects) => {
    let slug = data.slug as string | undefined;
    if (data.title_tr) {
        const baseSlug = slugify(data.title_tr);
        slug = await generateUniqueSlug(baseSlug, data.id);
    }
    const updateData = slug ? { ...data, slug } : data;
    const result = await db.update(projects).set(updateData).where(eq(projects.id, data.id)).returning();
    return result;
}

export const getProject = async (data: getProjects) => {
    const identifier = data.id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    
    if (isUuid) {
        const result = await db.select().from(projects).where(eq(projects.id, identifier));
        return result;
    } else {
        const result = await db.select().from(projects).where(eq(projects.slug, identifier));
        return result;
    }
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
