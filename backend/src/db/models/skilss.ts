import {pgTable, varchar, text, uuid, boolean} from "drizzle-orm/pg-core";

export const skilss = pgTable("skilss", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    icon: varchar("icon", {length: 255}).notNull(),

    title_tr: varchar("title_tr", {length: 255}).notNull(),
    title_en: varchar("title_en", {length: 255}).notNull(),
    title_de: varchar("title_de", {length: 255}).notNull(),
    title_ru: varchar("title_ru", {length: 255}).notNull(),

    element_tr: text("element_tr").notNull(),
    element_en: text("element_en").notNull(),
    element_de: text("element_de").notNull(),
    element_ru: text("element_ru").notNull(),

    is_active: boolean("is_active").default(true).notNull(),
});