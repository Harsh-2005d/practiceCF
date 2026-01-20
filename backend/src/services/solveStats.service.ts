import { prisma } from "../prismac";

export async function getLast30DaysHistogram(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 29);

  const solves = await prisma.solve.findMany({
    where: {
      userId,
      solvedAt: {
        gte: start,
      },
    },
    select: {
      solvedAt: true,
    },
  });

  // initialize 30-day array
  const counts = Array(30).fill(0);

  for (const s of solves) {
    const day = new Date(s.solvedAt);
    day.setHours(0, 0, 0, 0);

    const index =
      Math.floor((day.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (index >= 0 && index < 30) {
      counts[index]++;
    }
  }
  console.log("Histogram:", counts);

  return counts;
}
