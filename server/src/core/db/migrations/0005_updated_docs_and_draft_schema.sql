CREATE TYPE "public"."doc_permission" AS ENUM('private', 'workspace', 'public');--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "doc_img_url" text;--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "permission" "doc_permission" DEFAULT 'workspace' NOT NULL;--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "docs" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "drafts" ADD COLUMN "cover_image_config" jsonb;--> statement-breakpoint
ALTER TABLE "drafts" ADD COLUMN "settings" jsonb DEFAULT '{"fontStyle":"inter","fontSize":"16px","isFullWidth":false,"showCover":true,"showIcon":true,"showOwner":true,"showLastModified":true}'::jsonb;--> statement-breakpoint
ALTER TABLE "docs" ADD CONSTRAINT "docs_share_token_unique" UNIQUE("share_token");