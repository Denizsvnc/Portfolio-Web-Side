import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { visitors } from "./visitors";
import { blogs } from "./blogs";
import { projects } from "./projects";

export const pageViews = pgTable("page_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  visitor_id: uuid("visitor_id").references(() => visitors.id, { onDelete: "cascade" }),
  path: varchar("path", { length: 255 }).notNull(),
  ip_address: varchar("ip_address", { length: 45 }).notNull(),
  city: varchar("city", { length: 100 }).default("Unknown"),
  country: varchar("country", { length: 100 }).default("Unknown"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const blogAnalytics = pgTable("blog_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  blog_id: uuid("blog_id").references(() => blogs.id, { onDelete: "cascade" }).notNull(),
  visitor_id: uuid("visitor_id").references(() => visitors.id, { onDelete: "set null" }),
  event_type: varchar("event_type", { length: 50 }).notNull(), // 'read' or 'share'
  platform: varchar("platform", { length: 50 }),
  ip_address: varchar("ip_address", { length: 45 }),
  city: varchar("city", { length: 100 }).default("Unknown"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const projectAnalytics = pgTable("project_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  project_id: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  visitor_id: uuid("visitor_id").references(() => visitors.id, { onDelete: "set null" }),
  event_type: varchar("event_type", { length: 50 }).notNull(), // 'read' or 'share'
  platform: varchar("platform", { length: 50 }),
  ip_address: varchar("ip_address", { length: 45 }),
  city: varchar("city", { length: 100 }).default("Unknown"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
