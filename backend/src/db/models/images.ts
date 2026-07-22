import {pgTable, uuid, varchar, text, boolean, timestamp, integer} from "drizzle-orm/pg-core";
import { blogs } from "./blogs";

export const images = pgTable("images", {
    id: uuid("id").defaultRandom().primaryKey(),
    image_url: varchar("image_url", {length: 255}).notNull(),
    alt_text: varchar("alt_text", {length: 255}).notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    blogId: uuid("blog_id")
    .references(() => blogs.id, {
      onDelete: "cascade",
    })
    .notNull(),
     queue: integer("queue").default(0),
});

