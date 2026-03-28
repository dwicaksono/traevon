import { Scalar } from "@scalar/hono-api-reference";

/**
 * Scalar API Reference middleware for Hono.
 * Renders interactive API documentation from the OpenAPI spec served at /doc.
 */
export const scalarReference = Scalar({
  url: "/doc",
  theme: "saturn",
  pageTitle: "Traevon — AI Knowledge Platform API",
});
