/**
 * Thrown when an operation violates the Controlled Knowledge Boundary.
 *
 * Examples:
 * - Attempting to write directly to the knowledge base without a valid draft.
 * - Re-submitting a draft that has already been synced (WRITTEN_TO_SOURCE).
 * - Missing `authorized_by` signature on a finalization attempt.
 */
export declare class BoundaryError extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
