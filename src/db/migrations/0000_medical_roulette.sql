CREATE TYPE "public"."draft_status" AS ENUM('DRAFT_PENDING', 'DRAFT_APPROVED', 'DRAFT_REJECTED', 'WRITTEN_TO_SOURCE');--> statement-breakpoint
CREATE TABLE "ai_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"status" "draft_status" DEFAULT 'DRAFT_PENDING' NOT NULL,
	"authorized_by" text,
	"authorized_at" timestamp with time zone,
	"source_references" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_record_id" uuid,
	"prompt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text,
	"metadata" jsonb
);
