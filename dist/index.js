import { serve } from "@hono/node-server";
import { app } from "./app.js";
// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------
const PORT = Number(process.env["PORT"] ?? 3000);
serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
});
export default app;
