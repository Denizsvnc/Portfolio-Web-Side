import {pgTable, uuid, varchar, boolean} from "drizzle-orm/pg-core";

export const myInfo = pgTable("myInfo", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
    surname: varchar("surname", {length: 255}).notNull(),

    title_tr: varchar("title_tr", {length: 255}).notNull(),
    title_en: varchar("title_en", {length: 255}).notNull(),
    title_de: varchar("title_de", {length: 255}).notNull(),
    title_ru: varchar("title_ru", {length: 255}).notNull(),
    isActive: boolean("isActive").notNull().default(true),

    github_url: varchar("github_url", {length: 255}).notNull(),
    cv_url: varchar("cv_url", {length: 255}).notNull(),
});