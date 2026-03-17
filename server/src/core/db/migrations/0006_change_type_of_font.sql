CREATE TYPE "public"."font_size" AS ENUM('16px', '25px', '36px');--> statement-breakpoint
CREATE TYPE "public"."font_style" AS ENUM('sans', 'serif', 'mono');--> statement-breakpoint
ALTER TABLE "drafts" ALTER COLUMN "settings" SET DEFAULT '{"fontStyle":"sans","fontSize":"16px","isFullWidth":false,"showCover":true,"showIcon":true,"showOwner":true,"showLastModified":true}'::jsonb;