import { pgTable, uuid, text, boolean, varchar, jsonb } from "drizzle-orm/pg-core";

export const aiSettings = pgTable("ai_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  isActive: boolean("isActive").notNull().default(false),
  publishMode: varchar("publishMode", { length: 50 }).notNull().default('draft'), // 'draft' or 'auto_publish'
  scheduleCron: varchar("scheduleCron", { length: 50 }).notNull().default('0 9 * * 1'), // Default: Every Monday at 09:00
  
  personaData: jsonb("personaData").default({}), // Answers to interview questions
  toneOfVoice: text("toneOfVoice"),
  interests: text("interests"),
  customPrompts: text("customPrompts"),
});
