import { describe, it, expect, vi, beforeEach } from "vitest";

vi.hoisted(() => {
  process.env.DATABASE_URL = "postgres://mock:mock@localhost:5432/mock";
});

import { DraftService } from "../../src/modules/drafts/draft.service.js";
import { BoundaryError } from "../../src/core/errors/boundary.error.js";
import { integrationClient } from "../../src/modules/integrations/client.js";

// ---------------------------------------------------------------------------
// Mock Mocks
// ---------------------------------------------------------------------------

const mockDb: any = {
  transaction: vi.fn(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
};

vi.mock("../../src/modules/integrations/client.js", () => ({
  integrationClient: {
    writeToSource: vi.fn(),
  },
}));

describe("DraftService: Controlled Knowledge Boundary", () => {
  let service: DraftService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DraftService(mockDb);
  });

  describe("Rule 2: createDraft", () => {
    it("should successfully create a draft with PENDING status", async () => {
      const input = {
        content: "AI Generated Report",
        prompt: "Generate a summary of Q1 2024",
      };

      mockDb.returning.mockResolvedValue([{ id: "uuid-123", ...input, status: "DRAFT_PENDING" }]);

      const result = await service.createDraft(input);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result.status).toBe("DRAFT_PENDING");
    });
  });

  describe("Rule 3: approveAndSync", () => {
    it("should atomically update status and sync to external source", async () => {
      const draftId = "uuid-123";
      const existingDraft = {
        id: draftId,
        content: "Final Report",
        status: "DRAFT_PENDING",
      };

      // Mock transaction execution loop
      mockDb.transaction.mockImplementation(async (cb: any) => {
        return cb(mockDb);
      });

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.returning.mockResolvedValue([{ id: draftId, status: "WRITTEN_TO_SOURCE" }]);
      
      // First select call
      mockDb.where.mockResolvedValueOnce([existingDraft]);

      // Mock external API
      vi.mocked(integrationClient.writeToSource).mockResolvedValue({
        external_record_id: "ext-789",
      });

      const result = await service.approveAndSync({
        draft_id: draftId,
        authorized_by: "human_user_01",
      });

      expect(result.status).toBe("WRITTEN_TO_SOURCE");
      expect(integrationClient.writeToSource).toHaveBeenCalledWith(draftId, existingDraft.content);
    });

    it("should throw BoundaryError if the draft is already synced", async () => {
      const draftId = "uuid-already-synced";
      const existingDraft = {
        id: draftId,
        status: "WRITTEN_TO_SOURCE",
      };

      mockDb.transaction.mockImplementation(async (cb: any) => cb(mockDb));
      mockDb.where.mockResolvedValueOnce([existingDraft]);

      await expect(
        service.approveAndSync({
          draft_id: draftId,
          authorized_by: "human_user_01",
        })
      ).rejects.toThrow(BoundaryError);

      expect(integrationClient.writeToSource).not.toHaveBeenCalled();
    });

    it("should rollback visually (demonstrated by no second update) if sync fails", async () => {
      const draftId = "uuid-fail";
      const existingDraft = {
        id: draftId,
        status: "DRAFT_PENDING",
      };

      mockDb.transaction.mockImplementation(async (cb: any) => {
        try {
          return await cb(mockDb);
        } catch (e) {
             throw e;
        }
      });

      mockDb.where.mockResolvedValueOnce([existingDraft]);
      
      vi.mocked(integrationClient.writeToSource).mockRejectedValue(new Error("Network Error"));

      await expect(
        service.approveAndSync({
          draft_id: draftId,
          authorized_by: "human_user_01",
        })
      ).rejects.toThrow("Network Error");

      // Verify that the second update (stage 5: finalized) was never called
      // Wait, in our implementation we have stage 3 (update to APPROVED) and stage 5 (update to WRITTEN).
      // If writeToSource fails, Stage 5 should not execute.
      expect(mockDb.set).toHaveBeenCalledTimes(1); 
      // First call is Stage 3: DRAFT_APPROVED
      expect(mockDb.set).not.toHaveBeenCalledWith(expect.objectContaining({ status: "WRITTEN_TO_SOURCE" }));
    });
  });
});
