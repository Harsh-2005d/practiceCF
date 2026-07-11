import { prisma } from "../prismac";

const IST_OFFSET_MS = 0;

function getISTDayRangeUTCFromISTDate(istDate: Date) {
  // Start of that day in IST
  const startIST = new Date(istDate);
  startIST.setHours(0, 0, 0, 0);

  // Convert IST start → UTC
  const startUTC = new Date(startIST.getTime() - IST_OFFSET_MS);

  // End = +1 day (still in UTC)
  const endUTC = new Date(startUTC);
  endUTC.setUTCDate(endUTC.getUTCDate() + 1);

  return { startUTC, endUTC };
}

export const getRevisionSolves = async (userId: string) => {
  // 1️⃣ Compute now in IST
  const nowUTC = new Date();
  const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

  // 2️⃣ Target days in IST
  const yesterdayIST = new Date(nowIST);
  yesterdayIST.setDate(yesterdayIST.getDate() - 1);

  const weekBackIST = new Date(nowIST);
  weekBackIST.setDate(weekBackIST.getDate() - 7);

  const monthBackIST = new Date(nowIST);
  monthBackIST.setDate(monthBackIST.getDate() - 30);

  // 3️⃣ Convert IST days → UTC ranges
  const { startUTC: yStart, endUTC: yEnd } =
    getISTDayRangeUTCFromISTDate(yesterdayIST);

  const { startUTC: wStart, endUTC: wEnd } =
    getISTDayRangeUTCFromISTDate(weekBackIST);

  const { startUTC: mStart, endUTC: mEnd } =
    getISTDayRangeUTCFromISTDate(monthBackIST);

  console.log("FINAL IST DAY RANGES (UTC):", {
    yesterday: [yStart.toISOString(), yEnd.toISOString()],
    weekBack: [wStart.toISOString(), wEnd.toISOString()],
    monthBack: [mStart.toISOString(), mEnd.toISOString()]
  });

  const [previousDayResult, previousWeekResult, previousMonthResult] =
  await Promise.all([
    prisma.query(
      `
      SELECT *
      FROM "Solve"
      WHERE "userId" = $1
        AND "solvedAt" >= $2
        AND "solvedAt" < $3
      ORDER BY "solvedAt" ASC
      `,
      [userId, yStart, yEnd]
    ),

    prisma.query(
      `
      SELECT *
      FROM "Solve"
      WHERE "userId" = $1
        AND "solvedAt" >= $2
        AND "solvedAt" < $3
      ORDER BY "solvedAt" ASC
      `,
      [userId, wStart, wEnd]
    ),

    prisma.query(
      `
      SELECT *
      FROM "Solve"
      WHERE "userId" = $1
        AND "solvedAt" >= $2
        AND "solvedAt" < $3
      ORDER BY "solvedAt" ASC
      `,
      [userId, mStart, mEnd]
    ),
  ]);

const previousDay = previousDayResult.rows;
const previousWeek = previousWeekResult.rows;
const previousMonth = previousMonthResult.rows;

  return {
    previousDay,
    previousWeek,
    previousMonth
  };
};

