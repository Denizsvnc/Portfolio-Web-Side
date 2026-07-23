import {pgTable, varchar, text, uuid, boolean, integer} from "drizzle-orm/pg-core";

export const about = pgTable("about", {
    id: uuid("id").defaultRandom().primaryKey(),
    title_tr: varchar("title_tr", {length: 255}).notNull(),
    title_en: varchar("title_en", {length: 255}).notNull(),
    title_de: varchar("title_de", {length: 255}).notNull(),
    title_ru: varchar("title_ru", {length: 255}).notNull(),

    text_tr: text("text_tr").notNull(),
    text_en: text("text_en").notNull(),
    text_de: text("text_de").notNull(),
    text_ru: text("text_ru").notNull(),

    pp_url: varchar("pp_url", {length: 255}).notNull(),
    cv_url: varchar("cv_url", {length: 255}),
});