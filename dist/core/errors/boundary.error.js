/**
 * Thrown when an operation violates the Controlled Knowledge Boundary.
 *
 * Examples:
 * - Attempting to write directly to the knowledge base without a valid draft.
 * - Re-submitting a draft that has already been synced (WRITTEN_TO_SOURCE).
 * - Missing `authorized_by` signature on a finalization attempt.
 */
export class BoundaryError extends Error {
    code;
    constructor(message, code = "BOUNDARY_VIOLATION") {
        super(message);
        this.name = "BoundaryError";
        this.code = code;
    }
}
