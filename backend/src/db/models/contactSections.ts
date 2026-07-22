import {pgTable, varchar,  uuid, boolean} from "drizzle-orm/pg-core";
export const contactSections = pgTable("contactSections", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    icon: varchar("icon", {length: 255}).notNull(),
    
    title_tr: varchar("title", {length: 255}).notNull(),
    title_en: varchar("title_en", {length: 255}).notNull(),
    title_de: varchar("title_de", {length: 255}).notNull(),
    title_ru: varchar("title_ru", {length: 255}).notNull(),

    button_url: varchar("button_url", {length: 255}).notNull(),
    isActive: boolean("isActive").notNull().default(true),
});