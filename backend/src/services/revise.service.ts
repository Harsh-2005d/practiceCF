import { prisma } from "../prismac";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getIstDayRange(date: Date) {
  const startUTC = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - IST_OFFSET_MS,
  );
  const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
  return { startUTC, endUTC };
}

export function getRevisionDayKey(now = new Date()) {
  const istDate = new Date(now.getTime() + IST_OFFSET_MS);
  return `${istDate.getUTCFullYear()}-${String(istDate.getUTCMonth() + 1).padStart(2, "0")}-${String(istDate.getUTCDate()).padStart(2, "0")}`;
}

export function getSecondsUntilNextIstDay(now = new Date()) {
  const istDate = new Date(now.getTime() + IST_OFFSET_MS);
  const nextIstMidnight =
    Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate() + 1) - IST_OFFSET_MS;
  return Math.max(1, Math.ceil((nextIstMidnight - now.getTime()) / 1000));
}

export const getRevisionSolves = async (userId: string, now = new Date()) => {
  const nowIST = new Date(now.getTime() + IST_OFFSET_MS);
  const yesterdayIST = new Date(nowIST);
  yesterdayIST.setUTCDate(yesterdayIST.getUTCDate() - 1);
  const weekBackIST = new Date(nowIST);
  weekBackIST.setUTCDate(weekBackIST.getUTCDate() - 7);
  const monthBackIST = new Date(nowIST);
  monthBackIST.setUTCDate(monthBackIST.getUTCDate() - 30);

  const { startUTC: yStart, endUTC: yEnd } = getIstDayRange(yesterdayIST);
  const { startUTC: wStart, endUTC: wEnd } = getIstDayRange(weekBackIST);
  const { startUTC: mStart, endUTC: mEnd } = getIstDayRange(monthBackIST);

  const [previousDayResult, previousWeekResult, previousMonthResult] = await Promise.all([
    prisma.query(
      `SELECT * FROM "Solve" WHERE "userId" = $1 AND "solvedAt" >= $2 AND "solvedAt" < $3 ORDER BY "solvedAt" ASC`,
      [userId, yStart, yEnd],
    ),
    prisma.query(
      `SELECT * FROM "Solve" WHERE "userId" = $1 AND "solvedAt" >= $2 AND "solvedAt" < $3 ORDER BY "solvedAt" ASC`,
      [userId, wStart, wEnd],
    ),
    prisma.query(
      `SELECT * FROM "Solve" WHERE "userId" = $1 AND "solvedAt" >= $2 AND "solvedAt" < $3 ORDER BY "solvedAt" ASC`,
      [userId, mStart, mEnd],
    ),
  ]);

  return {
    previousDay: previousDayResult.rows,
    previousWeek: previousWeekResult.rows,
    previousMonth: previousMonthResult.rows,
  };
};
