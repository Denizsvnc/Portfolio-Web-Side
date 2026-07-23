import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { roles } from "./enum";

export const visitors = pgTable("visitors", {
  id: uuid("id").defaultRandom().primaryKey(),
  ip_address: varchar("ip_address", { length: 45 }).notNull(),
  user_agent: text("user_agent"),
  country: varchar("country", { length: 100 }).default("Unknown"),
  city: varchar("city", { length: 100 }).default("Unknown"),
  role: roles("role").notNull().default("visitor"),
  visit_count: integer("visit_count").notNull().default(1),
  last_visit: timestamp("last_visit").notNull().defaultNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
