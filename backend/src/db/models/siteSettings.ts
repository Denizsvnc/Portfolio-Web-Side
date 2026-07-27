import {pgTable, varchar, timestamp} from "drizzle-orm/pg-core";

export const siteSettings = pgTable("siteSettings", {
    key: varchar("key", {length: 100}).primaryKey(),
    value: varchar("value", {length: 1024}).notNull(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
