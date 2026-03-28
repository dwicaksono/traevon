import { timestamp, jsonb, text } from "drizzle-orm/pg-core";
/**
 * Reusable audit fields for all tables.
 * Rule 1: "Always define schemas with audit fields: created_at, updated_at, created_by,
 * and a metadata JSONB column."
 */
export const auditFields = {
    created_at: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    created_by: text("created_by"),
    metadata: jsonb("metadata").$type(),
};
