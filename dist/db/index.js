import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as draftsSchema from "./schemas/drafts.js";
// ---------------------------------------------------------------------------
// Supabase Postgres connection via postgres.js
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
}
// `prepare: false` is required when using Supabase's connection pooler
// in "Transaction" pool mode (the default for most Supabase projects).
const client = postgres(DATABASE_URL, { prepare: false });
export const db = drizzle({ client, schema: { ...draftsSchema } });
