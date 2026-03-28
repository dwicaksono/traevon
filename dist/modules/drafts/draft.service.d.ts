import { type Database } from "../../db/index.js";
import { aiDrafts, type SourceReference } from "../../db/schemas/drafts.js";
export interface CreateDraftInput {
    content: string;
    prompt?: string;
    source_references?: SourceReference[];
    created_by?: string;
}
export interface ApproveAndSyncInput {
    draft_id: string;
    authorized_by: string;
}
type AiDraftRow = typeof aiDrafts.$inferSelect;
export declare class DraftService {
    private readonly db;
    constructor(database?: Database);
    findById(id: string): Promise<AiDraftRow | null>;
    findAll(filters?: {
        status?: string;
    }): Promise<{
        drafts: AiDraftRow[];
        total: number;
    }>;
    /**
     * Persists a new AI-generated draft with status `DRAFT_PENDING`.
     * This is the ONLY entry-point for LLM output into the system.
     */
    createDraft(input: CreateDraftInput): Promise<AiDraftRow>;
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
    approveAndSync(input: ApproveAndSyncInput): Promise<AiDraftRow>;
}
export {};
