import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { draftsRouter } from "./api/v1/drafts.route.js";
import { scalarReference } from "./api/docs/scalar.js";

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const app = new OpenAPIHono();

// --- Health check (Top priority for diagnostics) ---------------------------
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// --- Global Error Handler ----------------------------------------------------
app.onError((err, c) => {
  console.error(`[App Error] ${err.message}`, {
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });
  return c.json({ 
    error: "Internal Server Error", 
    message: err.message,
    code: "UNHANDLED_EXCEPTION"
  }, 500);
});

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
      "AI output always lands as a Draft first. " +
      "Write-through to source requires authorized approval.",
  },
});

// --- Scalar interactive docs -----------------------------------------------
app.get("/reference", scalarReference);

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
