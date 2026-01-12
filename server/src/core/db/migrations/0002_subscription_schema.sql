CREATE TABLE "subscriptions" (
	"plan" "subscription_plan" PRIMARY KEY NOT NULL,
	"workspaces" integer NOT NULL,
	"projects_per_workspace" integer NOT NULL,
	"members_per_workspace" integer NOT NULL,
	"bandwidth" bigint NOT NULL,
	"storage" bigint NOT NULL,
	"docs_per_workspace" integer NOT NULL,
	"social_platforms" text[] NOT NULL
);
