import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { draftsRouter } from "./api/v1/drafts.route.js";
import { scalarReference } from "./api/docs/scalar.js";

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const app = new OpenAPIHono();

// --- API v1 routes ---------------------------------------------------------
app.route("/api/v1/drafts", draftsRouter);

// --- OpenAPI JSON spec (consumed by Scalar) --------------------------------
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Traevon — AI Knowledge Platform",
    version: "1.0.0",
    description:
      "Production-ready API with a Controlled Knowledge Boundary. " +
      "AI output always lands as a Draft first (Rule 2). " +
      "Write-through to source requires authorized approval.",
  },
});

// --- Scalar interactive docs -----------------------------------------------
app.get("/reference", scalarReference);

// --- Health check ----------------------------------------------------------
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// ---------------------------------------------------------------------------
// Server (only for non-Vercel/Local dev environments)
// ---------------------------------------------------------------------------

const PORT = Number(process.env["PORT"] ?? 3000);

if (process.env["NODE_ENV"] !== "production") {
  serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
    console.log(`📖 API docs at     http://localhost:${info.port}/reference`);
    console.log(`📄 OpenAPI spec at http://localhost:${info.port}/doc`);
  });
}

export default app;
