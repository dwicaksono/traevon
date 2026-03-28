import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";

// ---------------------------------------------------------------------------
// App Instance
// ---------------------------------------------------------------------------
const app = new OpenAPIHono();

// --- Health Check (Immediate return to prevent Gateway Timeouts) ------------
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

// --- Heavy Imports (Deferred to avoid boot-time hangs) -----------------------
// Note: In serverless, these are still resolved at start, but placing them 
// after basic routes can sometimes help with initialization order issues.
import { draftsRouter } from "./api/v1/drafts.route.js";
import { scalarReference } from "./api/docs/scalar.js";

// --- API v1 routes ---------------------------------------------------------
app.route("/api/v1/drafts", draftsRouter);

// --- OpenAPI JSON spec (consumed by Scalar) --------------------------------
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Traevon — AI Knowledge Platform",
    version: "1.0.0",
    description: "Production-ready API with a Controlled Knowledge Boundary.",
  },
});

// --- Scalar interactive docs -----------------------------------------------
app.get("/reference", scalarReference);

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------
if (process.env["NODE_ENV"] !== "production") {
  const PORT = Number(process.env["PORT"] ?? 3000);
  serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  });
}

export default app;
