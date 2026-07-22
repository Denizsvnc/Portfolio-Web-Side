CREATE TYPE "public"."mailStatus" AS ENUM('pending', 'sent', 'failed', 'read', 'unread', 'answered');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "about" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_tr" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_de" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"text_tr" text NOT NULL,
	"text_en" text NOT NULL,
	"text_de" text NOT NULL,
	"text_ru" text NOT NULL,
	"pp_url" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skilss" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(255) NOT NULL,
	"title_tr" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_de" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"element_tr" text NOT NULL,
	"element_en" text NOT NULL,
	"element_de" text NOT NULL,
	"element_ru" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(255) NOT NULL,
	"title_tr" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_de" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"element_tr" text NOT NULL,
	"element_en" text NOT NULL,
	"element_de" text NOT NULL,
	"element_ru" text NOT NULL,
	"button_url" varchar(255) NOT NULL,
	"queue" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contactBox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_tr" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"status" "mailStatus" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contactSections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"button_url" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"alt_text" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"blog_id" uuid NOT NULL,
	"queue" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(255),
	"img_url" varchar(255) NOT NULL,
	"title_tr" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_de" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"description_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_de" text NOT NULL,
	"description_ru" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;