import { prisma } from "../prismac";
import { syncLast24HoursSolves } from "../services/cfSolveSync.service";

const CONCURRENCY = 5;

export async function runDailyCfSyncJob() {
  console.log("Starting daily Codeforces sync...");

  const users = await prisma.user.findMany({
    select: { id: true, handle: true }
  });

  let index = 0;

  async function worker() {
    while (index < users.length) {
      const current = users[index++];
      try {
        await syncLast24HoursSolves(current.id, current.handle!);
        console.log(`Synced ${current.handle}`);
      } catch (err) {
        console.error(`Failed for ${current.handle}`, err);
      }
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  console.log("Daily Codeforces sync complete.");
}
