import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { contactMessages } from "./contactMessages";

export const contactReplies = pgTable("contact_replies", {
    id: uuid("id").primaryKey().defaultRandom(),
    message_id: uuid("message_id").references(() => contactMessages.id, { onDelete: 'cascade' }).notNull(),
    reply_body: text("reply_body").notNull(),
    attachments: text("attachments"), // JSON stringified array of { filename, path }
    created_at: timestamp("created_at").defaultNow().notNull(),
});
