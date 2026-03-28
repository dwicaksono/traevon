
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function runMigration() {
  console.log("Running manual migration: Changing target_record_id to text...");
  try {
    await sql`ALTER TABLE "ai_drafts" ALTER COLUMN "target_record_id" SET DATA TYPE text;`;
    console.log("Successfully updated column type!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await sql.end();
  }
}

runMigration();
