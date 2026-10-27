import {
  getRevisionDayKey,
  getRevisionSolves,
  getSecondsUntilNextIstDay,
} from "./revise.service";
import { getRedisValue, setRedisValue } from "./redis.service";

export type RevisionData = Awaited<ReturnType<typeof getRevisionSolves>>;

function cacheKey(userId: string, dayKey: string) {
  return `practicecf:revise:${userId}:${dayKey}`;
}

export async function getCachedRevisionSolves(userId: string): Promise<RevisionData | null> {
  const key = cacheKey(userId, getRevisionDayKey());
  try {
    const cached = await getRedisValue(key);
    if (cached) return JSON.parse(cached) as RevisionData;
  } catch (error) {
    console.warn("Redis revise cache read failed; loading from PostgreSQL:", error);
  }

  return null;
}

export async function loadRevisionSolvesAndCache(userId: string): Promise<RevisionData> {
  const now = new Date();
  const key = cacheKey(userId, getRevisionDayKey(now));
  const data = await getRevisionSolves(userId, now);
  await writeRevisionCache(key, data, now);
  return data;
}

export async function refreshRevisionCache(userId: string) {
  const now = new Date();
  const key = cacheKey(userId, getRevisionDayKey(now));
  const data = await getRevisionSolves(userId, now);
  await writeRevisionCache(key, data, now);
}

async function writeRevisionCache(key: string, data: RevisionData, now: Date) {
  try {
    await setRedisValue(key, JSON.stringify(data), getSecondsUntilNextIstDay(now));
  } catch (error) {
    console.warn("Redis revise cache write failed:", error);
  }
}
