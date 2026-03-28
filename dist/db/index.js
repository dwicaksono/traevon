import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as draftsSchema from "./schemas/drafts.js";
// ---------------------------------------------------------------------------
// Supabase Postgres connection via postgres.js
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) {
    const errorMessage = "❌ DATABASE_URL environment variable is not set. Check Vercel project settings.";
    if (process.env["NODE_ENV"] === "production") {
        console.error(errorMessage);
    }
    // In serverless, failing fast is better than timing out on localhost.
    throw new Error(errorMessage);
}
// `prepare: false` is required when using Supabase's connection pooler
// in "Transaction" pool mode. We also limit max connections for serverless.
const client = postgres(DATABASE_URL, {
    prepare: false,
    max: 1, // High concurrency in serverless can exhaust DB connections
    idle_timeout: 20, // Close idle connections faster
    connect_timeout: 5 // Fail fast if connection cannot be established
});
export const db = drizzle({ client, schema: { ...draftsSchema } });
