CREATE TYPE "public"."file_type" AS ENUM('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');--> statement-breakpoint
CREATE TYPE "public"."mime_type" AS ENUM('image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm', 'application/pdf', 'text/plain', 'audio/mpeg', 'audio/webm');--> statement-breakpoint
CREATE TYPE "public"."asset_type" AS ENUM('FILE', 'FOLDER');--> statement-breakpoint
CREATE TYPE "public"."upload_status" AS ENUM('UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_name" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_asset_id" uuid,
	"type" "asset_type" NOT NULL,
	"path" text NOT NULL,
	"depth" integer DEFAULT 0 NOT NULL,
	"mime_type" "mime_type",
	"s3_key" text,
	"imagekit_path" text,
	"file_size_bytes" bigint,
	"file_type" "file_type",
	"thumbnail_path" text,
	"video_duration_seconds" integer,
	"upload_status" "upload_status" DEFAULT 'UPLOADING',
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_assets_project_parent_name" UNIQUE("parent_asset_id","asset_name","project_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"project_cover_image_url" text,
	"project_owner_id" text NOT NULL,
	"storage_used" bigint DEFAULT 0 NOT NULL,
	"status" "project_status" DEFAULT 'ACTIVE' NOT NULL,
	"is_access_restricted" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_assets_project" ON "assets" USING btree ("project_id","parent_asset_id");