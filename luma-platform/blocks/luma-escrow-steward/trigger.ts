import "dotenv/config";
import { TaskClient, textPart } from "@blocks-network/sdk";

const AGENT_NAME = "lumanation_escrow_steward";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "{\"donor_name\":\"OpenHeart Foundation\",\"donor_type\":\"Foundation\",\"amount\":5000,\"currency\":\"USD\",\"specific_use_case\":\"\",\"prefer_general_purpose\":true,\"open_to_growth_strategy\":true}";

async function main() {
  const client = await TaskClient.create({
    billingMode: BILLING_MODE,
    apiKey: process.env.BLOCKS_API_KEY,
  });
  console.log(`Sending task to ${AGENT_NAME} (${BILLING_MODE})...`);
  const session = await client.sendMessage({
    agentName: AGENT_NAME,
    requestParts: [textPart(TEST_MESSAGE, "request")],
  });
  session.onProgress((e) => console.log("Progress:", e.message));
  const terminal = await session.waitForTerminal(90_000);
  console.log("Done:", terminal.state);
  if (terminal.state !== "completed") {
    console.log("Reason:", terminal.error || terminal.reason || "");
  }
  for (const ref of session.listArtifacts()) {
    const artifact = await session.downloadArtifact(ref);
    console.log("Artifact:", Buffer.from(artifact.data).toString("utf8"));
  }
  session.close();
  client.destroy();
}

main().catch((err) => {
  console.error("Trigger failed:", err);
  process.exit(1);
});
