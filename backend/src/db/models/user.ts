import { integer, pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";
import { roles } from "./enum";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  is_active: boolean().notNull().default(true),
  role: roles().notNull().default("user"),
  refreshToken: text("refresh_token"),
});
