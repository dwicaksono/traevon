/**
 * Mock Integration Client for External Knowledge Systems (Notion, SaaS, etc.)
 */
export class ExternalIntegrationClient {
  /**
   * Writes the approved content to an external source.
   *
   * @param draftId - The unique ID of the draft (used as an idempotency key).
   * @param content - The final approved content to record.
   * @returns An object containing the external system's generated record ID.
   */
  async writeToSource(
    draftId: string,
    content: string,
  ): Promise<{ external_record_id: string }> {
    // Rule 4: "Semua write-back ke sistem eksternal wajib menyertakan idempotency-key (menggunakan draft_id)"
    // Simulate an external API call with the idempotency header
    const headers = {
      "idempotency-key": draftId,
      "Content-Type": "application/json",
    };

    console.log(`[Integration] Writing to source with idempotency-key: ${draftId}`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Mock response from the external provider
    return {
      external_record_id: `ext_${crypto.randomUUID().split("-")[0]}`,
    };
  }
}

export const integrationClient = new ExternalIntegrationClient();
