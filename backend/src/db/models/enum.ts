import {pgEnum } from "drizzle-orm/pg-core";
export const mailStatus = pgEnum("mailStatus", ["pending", "sent", "failed", "read", "unread", "answered"]);

export const roles = pgEnum("roles", ["super_admin", "admin", "user"]);