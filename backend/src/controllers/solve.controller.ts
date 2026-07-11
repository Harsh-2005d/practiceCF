import { Request, Response } from "express";
import { prisma } from "../prismac";

export async function getSolves(req: Request, res: Response) {
  const { userId, filter } = req.query as {
    userId: string;
    filter: "yesterday" | "lastWeek" | "lastMonth";
  };

  if (!userId || !filter) {
    return res.status(400).json({ error: "Missing params" });
  }

  const now = new Date();
  let fromDate: Date;

  if (filter === "yesterday") {
    fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 1);
    fromDate.setHours(0, 0, 0, 0);
  } else if (filter === "lastWeek") {
    fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 7);
    fromDate.setHours(0, 0, 0, 0);
  } else {
    fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 30);
    fromDate.setHours(0, 0, 0, 0);
  }

  const result = await prisma.query(
  `
  SELECT *
  FROM solves
  WHERE user_id = $1
    AND solved_at >= $2
  ORDER BY solved_at DESC
  `,
  [userId, fromDate]
);

const solves = result.rows;

  res.json({ solves });
}
