import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";

export const emailSettings = pgTable("email_settings", {
    id: uuid("id").defaultRandom().primaryKey(),
    host: varchar("host", { length: 255 }).notNull(),
    port: integer("port").notNull(),
    secure: boolean("secure").notNull().default(false),
    user: varchar("user", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    from_email: varchar("from_email", { length: 255 }).notNull(),
    auto_forward: boolean("auto_forward").notNull().default(true),
});
