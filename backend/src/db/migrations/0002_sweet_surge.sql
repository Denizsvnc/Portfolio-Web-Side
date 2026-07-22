CREATE TYPE "public"."roles" AS ENUM('super_admin', 'admin', 'user');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "roles" DEFAULT 'user' NOT NULL;