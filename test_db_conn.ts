import { db } from "./src/db/index.js";
import { aiDrafts } from "./src/db/schemas/drafts.js";

async function testConnection() {
  try {
    console.log("Checking DB connection...");
    const result = await db.select().from(aiDrafts).limit(1);
    console.log("Connection successful! Tables are accessible.");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

testConnection();
