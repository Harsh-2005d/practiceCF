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

  const [previousDay, previousWeek, previousMonth] = await Promise.all([
    prisma.solve.findMany({
      where: { userId, solvedAt: { gte: yStart, lt: yEnd } },
      orderBy: { solvedAt: "asc" }
    }),
    prisma.solve.findMany({
      where: { userId, solvedAt: { gte: wStart, lt: wEnd } },
      orderBy: { solvedAt: "asc" }
    }),
    prisma.solve.findMany({
      where: { userId, solvedAt: { gte: mStart, lt: mEnd } },
      orderBy: { solvedAt: "asc" }
    })
  ]);

  return {
    previousDay,
    previousWeek,
    previousMonth
  };
};


// export const getRevisionSolves = async (userId: string) => {
//   const now = new Date();

//   console.log("========== REVISE DEBUG ==========");
//   console.log("User ID:", userId);
//   console.log("Now:", now.toISOString());

//   // --- target days ---
//   const yesterday = new Date(now);
//   yesterday.setDate(yesterday.getDate() - 1);

//   const weekBack = new Date(now);
//   weekBack.setDate(weekBack.getDate() - 7);

//   const monthBack = new Date(now);
//   monthBack.setDate(monthBack.getDate() - 30);

//   console.log("Yesterday (raw):", yesterday.toISOString());
//   console.log("7 days back (raw):", weekBack.toISOString());
//   console.log("30 days back (raw):", monthBack.toISOString());

//   const { start: yStart, end: yEnd } = getDayRange(yesterday);
//   const { start: wStart, end: wEnd } = getDayRange(weekBack);
//   const { start: mStart, end: mEnd } = getDayRange(monthBack);

//   console.log("Yesterday range:", {
//     start: yStart.toISOString(),
//     end: yEnd.toISOString()
//   });

//   console.log("Week-back range:", {
//     start: wStart.toISOString(),
//     end: wEnd.toISOString()
//   });

//   console.log("Month-back range:", {
//     start: mStart.toISOString(),
//     end: mEnd.toISOString()
//   });

//   // --- queries ---
//   const [previousDay, previousWeek, previousMonth] = await Promise.all([
//     prisma.solve.findMany({
//       where: {
//         userId,
//         solvedAt: { gte: yStart, lt: yEnd }
//       },
//       orderBy: { solvedAt: "asc" }
//     }),

//     prisma.solve.findMany({
//       where: {
//         userId,
//         solvedAt: { gte: wStart, lt: wEnd }
//       },
//       orderBy: { solvedAt: "asc" }
//     }),

//     prisma.solve.findMany({
//       where: {
//         userId,
//         solvedAt: { gte: mStart, lt: mEnd }
//       },
//       orderBy: { solvedAt: "asc" }
//     })
//   ]);

//   console.log("Results count:", {
//     previousDay: previousDay.length,
//     previousWeek: previousWeek.length,
//     previousMonth: previousMonth.length
//   });

//   console.log("========== END DEBUG ==========");

//   return {
//     previousDay,
//     previousWeek,
//     previousMonth
//   };
// };
