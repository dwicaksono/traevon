import { pgTable, pgEnum, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { auditFields } from "./_columns.helpers.js";
// ---------------------------------------------------------------------------
// Enums — "Controlled Knowledge Boundary" status lifecycle
// Rule 1: "Use Enums for statuses like DRAFT_PENDING, DRAFT_APPROVED, WRITTEN_TO_SOURCE."
// ---------------------------------------------------------------------------
export const draftStatusEnum = pgEnum("draft_status", [
    "DRAFT_PENDING",
    "DRAFT_APPROVED",
    "DRAFT_REJECTED",
    "WRITTEN_TO_SOURCE",
]);
// ---------------------------------------------------------------------------
// Table — ai_drafts
// ---------------------------------------------------------------------------
/**
 * Central table for all AI-generated draft artifacts.
 *
 * "Any function that interacts with the LLM must return a Draft object,
 * not the final result."
 *
 * The `id` doubles as the idempotency-key for write-back operations
 * to external systems (Notion, SaaS).
 */
export const aiDrafts = pgTable("ai_drafts", {
    /** Primary key — also used as the idempotency key (Rule 4). */
    id: uuid("id").defaultRandom().primaryKey(),
    /** Raw content returned by the LLM. */
    content: text("content").notNull(),
    /** Boundary status — tracks the draft through approval lifecycle. */
    status: draftStatusEnum("status").default("DRAFT_PENDING").notNull(),
    /** User or service account that approved/rejected the draft. */
    authorized_by: text("authorized_by"),
    /** Timestamp of approval or rejection decision. */
    authorized_at: timestamp("authorized_at", { withTimezone: true }),
    /**
     * JSONB array of source references the AI used to produce this draft.
     * Enables traceability back to original knowledge sources.
     */
    source_references: jsonb("source_references")
        .$type()
        .default([])
        .notNull(),
    /** Foreign key to the knowledge_base record (populated after WRITTEN_TO_SOURCE). */
    target_record_id: text("target_record_id"),
    /** Free-form prompt or instruction that produced this draft. */
    prompt: text("prompt"),
    // Audit fields (Rule 1)
    ...auditFields,
});
