import { pgTable, uuid, varchar, boolean, text, timestamp } from "drizzle-orm/pg-core";

export const contactMessages = pgTable("contact_messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    is_read: boolean("is_read").notNull().default(false),
    is_replied: boolean("is_replied").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
});
