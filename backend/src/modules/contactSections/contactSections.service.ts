import { db } from "../../db";
import { contactSections } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const getAllContactSections = async () => {
  return await db.select().from(contactSections);
};

export const getContactSectionById = async (id: string) => {
  const result = await db.select().from(contactSections).where(eq(contactSections.id, id));
  return result[0];
};

export const createContactSection = async (data: typeof contactSections.$inferInsert) => {
  const result = await db.insert(contactSections).values(data).returning();
  return result[0];
};

export const updateContactSection = async (id: string, data: Partial<typeof contactSections.$inferInsert>) => {
  const result = await db.update(contactSections).set(data).where(eq(contactSections.id, id)).returning();
  return result[0];
};

export const deleteContactSection = async (id: string) => {
  const result = await db.delete(contactSections).where(eq(contactSections.id, id)).returning();
  return result[0];
};
