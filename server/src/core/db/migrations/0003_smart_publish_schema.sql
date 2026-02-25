CREATE TYPE "public"."social_account_status" AS ENUM('CONNECTED', 'EXPIRED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('YOUTUBE', 'LINKEDIN', 'TWITTER');--> statement-breakpoint
CREATE TYPE "public"."social_post_status" AS ENUM('DRAFT', 'UPLOADING', 'PUBLISHED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."social_visibility" AS ENUM('PUBLIC', 'PRIVATE', 'UNLISTED');--> statement-breakpoint
CREATE TABLE "social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"platform" "social_platform" NOT NULL,
	"platform_user_id" text NOT NULL,
	"avatar_url" text,
	"cover_url" text,
	"account_name" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"access_token_expires_at" timestamp,
	"scope" text,
	"status" "social_account_status" DEFAULT 'CONNECTED' NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"social_account_id" uuid NOT NULL,
	"platform" "social_platform" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"tags" json,
	"visibility" "social_visibility" NOT NULL,
	"platform_post_id" text,
	"platform_url" text,
	"status" "social_post_status" DEFAULT 'DRAFT' NOT NULL,
	"error_message" text,
	"published_at" timestamp,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;