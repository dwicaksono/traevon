/**
 * Mock Integration Client for External Knowledge Systems (Notion, SaaS, etc.)
 */
export declare class ExternalIntegrationClient {
    /**
     * Writes the approved content to an external source.
     *
     * @param draftId - The unique ID of the draft (used as an idempotency key).
     * @param content - The final approved content to record.
     * @returns An object containing the external system's generated record ID.
     */
    writeToSource(draftId: string, content: string): Promise<{
        external_record_id: string;
    }>;
}
export declare const integrationClient: ExternalIntegrationClient;
