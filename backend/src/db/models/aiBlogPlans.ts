import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const aiBlogPlans = pgTable("ai_blog_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  topic: text("topic").notNull(),
  scheduledDate: timestamp("scheduledDate", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending' | 'completed' | 'failed'
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});
