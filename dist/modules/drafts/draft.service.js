import { eq, and, count } from "drizzle-orm";
import { db } from "../../db/index.js";
import { aiDrafts } from "../../db/schemas/drafts.js";
import { BoundaryError } from "../../core/errors/boundary.error.js";
import { integrationClient } from "../integrations/client.js";
// ---------------------------------------------------------------------------
// DraftService
// ---------------------------------------------------------------------------
export class DraftService {
    db;
    constructor(database = db) {
        this.db = database;
    }
    // -------------------------------------------------------------------------
    // findById
    // -------------------------------------------------------------------------
    async findById(id) {
        const [draft] = await this.db.select().from(aiDrafts).where(eq(aiDrafts.id, id));
        return draft ?? null;
    }
    // -------------------------------------------------------------------------
    // findAll
    // -------------------------------------------------------------------------
    async findAll(filters = {}) {
        const conditions = [];
        if (filters.status) {
            conditions.push(eq(aiDrafts.status, filters.status));
        }
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const drafts = await this.db.select().from(aiDrafts).where(whereClause);
        const [totalRes] = await this.db.select({ value: count() }).from(aiDrafts).where(whereClause);
        return {
            drafts,
            total: totalRes?.value ?? 0,
        };
    }
    // -------------------------------------------------------------------------
    // createDraft (Rule 2)
    // -------------------------------------------------------------------------
    /**
     * Persists a new AI-generated draft with status `DRAFT_PENDING`.
     * This is the ONLY entry-point for LLM output into the system.
     */
    async createDraft(input) {
        const [draft] = await this.db
            .insert(aiDrafts)
            .values({
            content: input.content,
            prompt: input.prompt ?? null,
            source_references: input.source_references ?? [],
            created_by: input.created_by ?? null,
            status: "DRAFT_PENDING",
        })
            .returning();
        if (!draft) {
            throw new Error("Failed to insert draft — no row returned.");
        }
        return draft;
    }
    // -------------------------------------------------------------------------
    // approveAndSync ("Approve & Sync" Transaction Flow)
    // -------------------------------------------------------------------------
    /**
     * Atomically approves a draft and synchronizes it with the external source system.
     *
     * Transaction Flow:
     *   1. Fetch the draft and verify its state (No re-syncing).
     *   2. Update the status to `DRAFT_APPROVED` with the authorizer signature.
     *   3. Call the external integration with Rule 4 (Idempotency check).
     *   4. Finalize the draft status to `WRITTEN_TO_SOURCE`.
     *
     * @throws {BoundaryError} If the draft is already synced or not found.
     */
    async approveAndSync(input) {
        return await this.db.transaction(async (tx) => {
            // 1. Fetch current draft from the transaction pool.
            const [existing] = await tx
                .select()
                .from(aiDrafts)
                .where(eq(aiDrafts.id, input.draft_id));
            if (!existing) {
                throw new BoundaryError(`Draft "${input.draft_id}" was not found in the knowledge system.`, "DRAFT_NOT_FOUND");
            }
            // 2. Guard: Prevent duplicate writes (Idempotency).
            if (existing.status === "WRITTEN_TO_SOURCE") {
                throw new BoundaryError(`Draft "${input.draft_id}" has already been synchronized. 
           Re-submitting to source is forbidden.`, "ALREADY_SYNCED");
            }
            const now = new Date();
            // 3. Update status to APPROVED (The Authorizer Signature).
            await tx
                .update(aiDrafts)
                .set({
                status: "DRAFT_APPROVED",
                authorized_by: input.authorized_by,
                authorized_at: now,
                updated_at: now,
                metadata: {
                    ...(existing.metadata ?? {}),
                    approval_log: {
                        approved_by: input.authorized_by,
                        timestamp: now.toISOString(),
                    },
                },
            })
                .where(eq(aiDrafts.id, input.draft_id));
            // 4. Sync to source with idempotency-key (draft_id).
            // If writeToSource throws, the transaction will roll back automatically.
            const { external_record_id } = await integrationClient.writeToSource(existing.id, existing.content);
            // 5. Success! Finalize the boundary transition.
            const [finalized] = await tx
                .update(aiDrafts)
                .set({
                status: "WRITTEN_TO_SOURCE",
                target_record_id: external_record_id,
                updated_at: new Date(),
                metadata: {
                    ...(existing.metadata ?? {}),
                    approval_log: {
                        approved_by: input.authorized_by,
                        timestamp: now.toISOString(),
                    },
                    sync_log: {
                        external_id: external_record_id,
                        synced_at: new Date().toISOString(),
                    },
                },
            })
                .where(eq(aiDrafts.id, input.draft_id))
                .returning();
            return finalized;
        });
    }
}
