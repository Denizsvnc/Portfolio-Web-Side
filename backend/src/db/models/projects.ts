import { pgTable, varchar, text, uuid, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", {length: 255}).unique(),
    icon: varchar("icon", {length: 255}).notNull().default("folder"),

    title_tr: varchar("title_tr", {length: 255}).notNull(),
    title_en: varchar("title_en", {length: 255}).notNull(),
    title_de: varchar("title_de", {length: 255}).notNull(),
    title_ru: varchar("title_ru", {length: 255}).notNull(),

    element_tr: text("element_tr").notNull(),
    element_en: text("element_en").notNull(),
    element_de: text("element_de").notNull(),
    element_ru: text("element_ru").notNull(),

    innovation_tr: text("innovation_tr"),
    innovation_en: text("innovation_en"),
    innovation_de: text("innovation_de"),
    innovation_ru: text("innovation_ru"),

    tech_stack: varchar("tech_stack", {length: 255}),
    button_url: varchar("button_url", {length: 255}).notNull(),
    demo_url: varchar("demo_url", {length: 255}),

    attachments: jsonb("attachments").default([]).notNull(),
    links: jsonb("links").default([]).notNull(),
    
    isSignature: boolean("isSignature").notNull().default(false),
    queue: integer("queue").notNull().default(0),
    isActive: boolean("isActive").notNull().default(true),
    views: integer("views").notNull().default(0),
    shares: integer("shares").notNull().default(0),
});