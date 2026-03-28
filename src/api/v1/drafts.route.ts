import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { DraftService } from "../../modules/drafts/draft.service.js";
import {
  CreateDraftDto,
  FinalizeDraftDto,
  ListDraftsQueryDto,
  DraftListResponseDto,
  DraftIdParam,
  DraftResponseDto,
  ErrorResponseDto,
} from "../../modules/drafts/draft.dto.js";
import { BoundaryError } from "../../core/errors/boundary.error.js";

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const listDraftsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Drafts"],
  summary: "List all drafts",
  description: "Retrieves all drafts in the system with optional status filtering.",
  request: {
    query: ListDraftsQueryDto,
  },
  responses: {
    200: {
      content: { "application/json": { schema: DraftListResponseDto } },
      description: "Successfully retrieved draft list",
    },
  },
});

const getDraftRoute = createRoute({
  method: "get",
  path: "/{draft_id}",
  tags: ["Drafts"],
  summary: "Get draft by ID",
  description: "Retrieves a single draft by its UUID.",
  request: {
    params: DraftIdParam,
  },
  responses: {
    200: {
      content: { "application/json": { schema: DraftResponseDto } },
      description: "Successfully retrieved draft",
    },
    404: {
      content: { "application/json": { schema: ErrorResponseDto } },
      description: "Draft not found",
    },
  },
});

const createDraftRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Drafts"],
  summary: "Create a new AI draft",
  description:
    "Rule 2: Any LLM output must land here as a Draft object first. " +
    "Direct writes to the knowledge base are forbidden.",
  request: {
    body: {
      content: { "application/json": { schema: CreateDraftDto } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: DraftResponseDto } },
      description: "Draft created successfully",
    },
    400: {
      content: { "application/json": { schema: ErrorResponseDto } },
      description: "Validation error",
    },
  },
});

const finalizeRoute = createRoute({
  method: "post",
  path: "/{draft_id}/finalize",
  tags: ["Drafts"],
  summary: "Finalize and write draft to source",
  description:
    "Atomically approves a draft and writes it to the external source system. " +
    "Uses a Postgres transaction — rolls back if the external call fails. " +
    "Prevents re-submitting an already-synced draft.",
  request: {
    params: DraftIdParam,
    body: {
      content: { "application/json": { schema: FinalizeDraftDto } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: DraftResponseDto } },
      description: "Draft finalized and written to source",
    },
    404: {
      content: { "application/json": { schema: ErrorResponseDto } },
      description: "Draft not found",
    },
    409: {
      content: { "application/json": { schema: ErrorResponseDto } },
      description: "Draft already synced to source",
    },
  },
});

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const draftsRouter = new OpenAPIHono();
const draftService = new DraftService();

// Helper to format DB row to DTO
function formatDraft(draft: any) {
  return {
    ...draft,
    authorized_at: draft.authorized_at?.toISOString() ?? null,
    created_at: draft.created_at.toISOString(),
    updated_at: draft.updated_at.toISOString(),
    source_references: draft.source_references as Record<string, unknown>[],
    metadata: (draft.metadata as Record<string, unknown>) ?? null,
  };
}

// GET /
draftsRouter.openapi(listDraftsRoute, async (c) => {
  const query = c.req.valid("query");
  const { drafts, total } = await draftService.findAll(query);

  return c.json({ drafts: drafts.map(formatDraft), total }, 200);
});

// GET /:draft_id
draftsRouter.openapi(getDraftRoute, async (c) => {
  const { draft_id } = c.req.valid("param");
  const draft = await draftService.findById(draft_id);

  if (!draft) {
    return c.json({ error: "Draft not found", code: "NOT_FOUND" }, 404);
  }

  return c.json(formatDraft(draft), 200);
});

// POST /
draftsRouter.openapi(createDraftRoute, async (c) => {
  const body = c.req.valid("json");
  const draft = await draftService.createDraft(body);

  return c.json(formatDraft(draft), 201);
});

// POST /:draft_id/finalize
draftsRouter.openapi(finalizeRoute, async (c) => {
  const { draft_id } = c.req.valid("param");
  const { authorized_by } = c.req.valid("json");

  try {
    const draft = await draftService.approveAndSync({
      draft_id,
      authorized_by,
    });

    return c.json(formatDraft(draft), 200);
  } catch (err) {
    if (err instanceof BoundaryError) {
      const status = err.code === "DRAFT_NOT_FOUND" ? 404 : 409;
      return c.json({ error: err.message, code: err.code }, status as 404 | 409);
    }
    throw err;
  }
});
