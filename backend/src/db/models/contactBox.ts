import {pgTable, varchar,  uuid, timestamp} from "drizzle-orm/pg-core";
import { mailStatus } from "../schema";

export const contactBox = pgTable("contactBox", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    title_tr: varchar("title_tr", {length: 255}).notNull(),
    subject: varchar("subject", {length: 255}).notNull(),
    description: varchar("description", {length: 1024}).notNull(),
   
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    status: mailStatus("status").notNull().default("pending"),
});