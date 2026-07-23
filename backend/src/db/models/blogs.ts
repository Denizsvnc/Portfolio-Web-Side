import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  icon: varchar("icon", { length: 255 }),
  img_url: varchar("img_url", { length: 255 }).notNull(),

  title_tr: varchar("title_tr", { length: 255 }).notNull(),
  title_en: varchar("title_en", { length: 255 }).notNull(),
  title_de: varchar("title_de", { length: 255 }).notNull(),
  title_ru: varchar("title_ru", { length: 255 }).notNull(),

  description_tr: text("description_tr").notNull(),
  description_en: text("description_en").notNull(),
  description_de: text("description_de").notNull(),
  description_ru: text("description_ru").notNull(),

  queue: integer("queue").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  views: integer("views").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});