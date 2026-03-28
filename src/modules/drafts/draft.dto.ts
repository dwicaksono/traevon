import { z } from "@hono/zod-openapi";

// ---------------------------------------------------------------------------
// Request DTOs (Rule 3: "Use Zod for all Request/Response DTOs.")
// ---------------------------------------------------------------------------

export const CreateDraftDto = z
  .object({
    content: z.string().min(1).openapi({ description: "Raw content from the LLM" }),
    prompt: z.string().optional().openapi({ description: "The prompt/instruction that produced this draft" }),
    source_references: z
      .array(
        z.object({
          source_id: z.string(),
          source_type: z.string(),
          url: z.string().url().optional(),
          title: z.string().optional(),
          retrieved_at: z.string().datetime().optional(),
        }),
      )
      .optional()
      .default([])
      .openapi({ description: "Sources the AI used to produce this draft" }),
    created_by: z.string().optional().openapi({ description: "User or service account creating the draft" }),
  })
  .openapi("CreateDraftDto");

export const FinalizeDraftDto = z
  .object({
    authorized_by: z
      .string()
      .min(1)
      .openapi({ description: "User or service account authorizing the write-through" }),
  })
  .openapi("FinalizeDraftDto");

export const ListDraftsQueryDto = z
  .object({
    status: z
      .enum(["DRAFT_PENDING", "DRAFT_APPROVED", "DRAFT_REJECTED", "WRITTEN_TO_SOURCE"])
      .optional()
      .openapi({ description: "Filter by draft status", param: { name: "status", in: "query" } }),
  })
  .openapi("ListDraftsQueryDto");

// ---------------------------------------------------------------------------
// Path params
// ---------------------------------------------------------------------------

export const DraftIdParam = z
  .object({
    draft_id: z.string().uuid().openapi({ description: "UUID of the draft", param: { name: "draft_id", in: "path" } }),
  })
  .openapi("DraftIdParam");

// ---------------------------------------------------------------------------
// Response DTOs
// ---------------------------------------------------------------------------

export const DraftResponseDto = z
  .object({
    id: z.string().uuid(),
    content: z.string(),
    status: z.enum(["DRAFT_PENDING", "DRAFT_APPROVED", "DRAFT_REJECTED", "WRITTEN_TO_SOURCE"]),
    authorized_by: z.string().nullable(),
    authorized_at: z.string().nullable(),
    source_references: z.array(z.record(z.string(), z.unknown())),
    target_record_id: z.string().uuid().nullable(),
    prompt: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    created_by: z.string().nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
  })
  .openapi("DraftResponse");

export const DraftListResponseDto = z
  .object({
    drafts: z.array(DraftResponseDto),
    total: z.number().openapi({ description: "Total number of drafts" }),
  })
  .openapi("DraftListResponse");

export const ErrorResponseDto = z
  .object({
    error: z.string(),
    code: z.string(),
  })
  .openapi("ErrorResponse");
