import cron from "node-cron";
import { runDailyCfSyncJob } from "../jobs/dailySync.job";

// Runs every day at 12:00 AM server time
cron.schedule("0 0 * * *", async () => {
  try {
    await runDailyCfSyncJob();
  } catch (err) {
    console.error("Daily CF sync job crashed", err);
  }
});
