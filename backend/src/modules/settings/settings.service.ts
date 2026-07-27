import { db } from "../../db";
import { siteSettings } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getAllSettings = async () => {
  const data = await db.select().from(siteSettings);
  // Convert array of {key, value} to object
  const settingsObj: Record<string, string> = {};
  for (const item of data) {
    settingsObj[item.key] = item.value;
  }
  return settingsObj;
};

export const upsertSetting = async (key: string, value: string) => {
  await db.insert(siteSettings).values({ key, value })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() }
    });
};

export const getSettingByKey = async (key: string) => {
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
  return result[0]?.value || null;
};
