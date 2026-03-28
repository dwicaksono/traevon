import { OpenAPIHono } from "@hono/zod-openapi";
import { draftsRouter } from "./api/v1/drafts.route.js";
import { scalarReference } from "./api/docs/scalar.js";

// --- App Instance -----------------------------------------------------------
export const app = new OpenAPIHono();

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
