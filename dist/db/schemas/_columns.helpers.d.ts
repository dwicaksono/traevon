/**
 * Reusable audit fields for all tables.
 * Rule 1: "Always define schemas with audit fields: created_at, updated_at, created_by,
 * and a metadata JSONB column."
 */
export declare const auditFields: {
    created_at: import("drizzle-orm").NotNull<import("drizzle-orm").HasDefault<import("drizzle-orm/pg-core").PgTimestampBuilderInitial<"created_at">>>;
    updated_at: import("drizzle-orm").NotNull<import("drizzle-orm").HasDefault<import("drizzle-orm/pg-core").PgTimestampBuilderInitial<"updated_at">>>;
    created_by: import("drizzle-orm/pg-core").PgTextBuilderInitial<"created_by", [string, ...string[]]>;
    metadata: import("drizzle-orm").$Type<import("drizzle-orm/pg-core").PgJsonbBuilderInitial<"metadata">, Record<string, unknown>>;
};
