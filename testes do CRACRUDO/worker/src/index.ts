import { setTimeout as sleep } from "node:timers/promises";
import { writeHealthLog } from "../logs/health";
import { runWorkerOnce } from "../jobs/runner";
import { workerConfig } from "./config";

async function main() {
  const once = process.argv.includes("--once");

  await writeHealthLog("info", once ? "Worker started in single-run mode" : "Worker started");

  do {
    const processed = await runWorkerOnce();

    if (once) {
      break;
    }

    if (!processed) {
      await sleep(workerConfig.pollIntervalMs);
    }
  } while (true);
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : "Unknown worker boot error";
  await writeHealthLog("critical", "Worker crashed", { error: message }).catch(() => undefined);
  process.exit(1);
});
