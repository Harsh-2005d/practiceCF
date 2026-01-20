import { prisma } from "../prismac";
import { CodeforcesResponse, CfSubmission } from "../types/codeforces";

const PAGE_SIZE = 100;
const MAX_PAGES = 10;     // hard safety cap
const DELAY_MS = 300;     // prevent CF rate-limit

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export async function syncLast30DaysSolves(
  userId: string,
  handle: string
) {
  const cutoff =
    Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  let from = 1;
  let pagesFetched = 0;

  const seen = new Set<string>();
  const solves: {
    userId: string;
    contestId: number;
    index: string;
    link: string;
    solvedAt: Date;
  }[] = [];

  while (pagesFetched < MAX_PAGES) {
    pagesFetched++;

    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${PAGE_SIZE}`
    );

    if (!res.ok) break;

    const data =
      (await res.json()) as CodeforcesResponse<CfSubmission>;

    if (data.status !== "OK") break;
    if (data.result.length === 0) break;

    for (const s of data.result) {
      // submissions are sorted newest → oldest
      if (s.creationTimeSeconds < cutoff) {
        pagesFetched = MAX_PAGES;
        break;
      }

      if (s.verdict !== "OK") continue;

      const key = `${s.problem.contestId}-${s.problem.index}`;
      if (seen.has(key)) continue;

      seen.add(key);

      solves.push({
        userId,
        contestId: s.problem.contestId,
        index: s.problem.index,
        link: `https://codeforces.com/problemset/problem/${s.problem.contestId}/${s.problem.index}`,
        solvedAt: new Date(s.creationTimeSeconds * 1000)
      });
    }

    from += PAGE_SIZE;
    console.log("working")
    await sleep(DELAY_MS);
  }

  if (solves.length === 0) return;

  await prisma.solve.createMany({
    data: solves,
    skipDuplicates: true
  });
}

export async function syncLast24HoursSolves(
  userId: string,
  handle: string
) {
  const cutoff =
    Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  let from = 1;
  let pagesFetched = 0;

  const seen = new Set<string>();
  const solves: {
    userId: string;
    contestId: number;
    index: string;
    link: string;
    solvedAt: Date;
  }[] = [];

  while (pagesFetched < 3) {
    pagesFetched++;

    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${PAGE_SIZE}`
    );

    if (!res.ok) break;

    const data =
      (await res.json()) as CodeforcesResponse<CfSubmission>;

    if (data.status !== "OK") break;
    if (data.result.length === 0) break;

    for (const s of data.result) {
      if (s.creationTimeSeconds < cutoff) {
        pagesFetched = 3;
        break;
      }

      if (s.verdict !== "OK") continue;

      const key = `${s.problem.contestId}-${s.problem.index}`;
      if (seen.has(key)) continue;

      seen.add(key);

      solves.push({
        userId,
        contestId: s.problem.contestId!,
        index: s.problem.index!,
        link: `https://codeforces.com/problemset/problem/${s.problem.contestId}/${s.problem.index}`,
        solvedAt: new Date(s.creationTimeSeconds * 1000)
      });
    }

    from += PAGE_SIZE;
    await sleep(DELAY_MS);
  }

  if (solves.length === 0) return;

  await prisma.solve.createMany({
    data: solves,
    skipDuplicates: true
  });
}

