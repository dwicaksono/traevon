
const BASE_URL = "http://localhost:3000/api/v1/drafts";

async function runTests() {
  console.log("--- Starting API Endpoint Tests ---");

  try {
    // 1. Create a draft
    console.log("\n1. Testing POST /");
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "Test content for endpoint verification",
        created_by: "test-user"
      })
    });
    const draft = await createRes.json() as any;
    console.log("Created Draft ID:", draft.id);

    // 2. List drafts
    console.log("\n2. Testing GET /");
    const listRes = await fetch(BASE_URL);
    const listData = await listRes.json() as any;
    console.log("Total Drafts:", listData.total);
    console.log("First Draft Status:", listData.drafts[0]?.status);

    // 3. Get individual draft
    console.log(`\n3. Testing GET /${draft.id}`);
    const detailRes = await fetch(`${BASE_URL}/${draft.id}`);
    const detailData = await detailRes.json() as any;
    console.log("Detail Match:", detailData.id === draft.id);

    // 4. Finalize/Sync
    console.log(`\n4. Testing POST /${draft.id}/finalize`);
    const syncRes = await fetch(`${BASE_URL}/${draft.id}/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorized_by: "admin-verifier" })
    });
    const syncedData = await syncRes.json() as any;
    console.log("Final Status:", syncedData.status);

  } catch (err) {
    console.error("Test failed. Is the server running at localhost:3000?", err);
  }
}

runTests();
