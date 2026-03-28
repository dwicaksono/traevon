export declare const draftStatusEnum: import("drizzle-orm/pg-core").PgEnum<["DRAFT_PENDING", "DRAFT_APPROVED", "DRAFT_REJECTED", "WRITTEN_TO_SOURCE"]>;
/** Shape of each entry in the `source_references` JSONB array. */
export type SourceReference = {
    source_id: string;
    source_type: string;
    url?: string;
    title?: string;
    retrieved_at?: string;
};
/**
 * Central table for all AI-generated draft artifacts.
 *
 * "Any function that interacts with the LLM must return a Draft object,
 * not the final result."
 *
 * The `id` doubles as the idempotency-key for write-back operations
 * to external systems (Notion, SaaS).
 */
export declare const aiDrafts: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "ai_drafts";
    schema: undefined;
    columns: {
        created_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "ai_drafts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updated_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "ai_drafts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        created_by: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_by";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        metadata: import("drizzle-orm/pg-core").PgColumn<{
            name: "metadata";
            tableName: "ai_drafts";
            dataType: "json";
            columnType: "PgJsonb";
            data: Record<string, unknown>;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: Record<string, unknown>;
        }>;
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        content: import("drizzle-orm/pg-core").PgColumn<{
            name: "content";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "DRAFT_PENDING" | "DRAFT_APPROVED" | "DRAFT_REJECTED" | "WRITTEN_TO_SOURCE";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["DRAFT_PENDING", "DRAFT_APPROVED", "DRAFT_REJECTED", "WRITTEN_TO_SOURCE"];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorized_by: import("drizzle-orm/pg-core").PgColumn<{
            name: "authorized_by";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorized_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "authorized_at";
            tableName: "ai_drafts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        source_references: import("drizzle-orm/pg-core").PgColumn<{
            name: "source_references";
            tableName: "ai_drafts";
            dataType: "json";
            columnType: "PgJsonb";
            data: SourceReference[];
            driverParam: unknown;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: SourceReference[];
        }>;
        target_record_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "target_record_id";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        prompt: import("drizzle-orm/pg-core").PgColumn<{
            name: "prompt";
            tableName: "ai_drafts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
