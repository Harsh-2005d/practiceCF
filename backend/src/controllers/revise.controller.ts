import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prismac";
import {
  getCachedRevisionSolves,
  loadRevisionSolvesAndCache,
} from "../services/revisionCache.service";

export const reviseController = async (req: AuthedRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const cachedData = await getCachedRevisionSolves(userId);
    if (cachedData) {
      return res.status(200).json({ success: true, ...cachedData });
    }

    const result = await prisma.query(
      `SELECT handle FROM "User" WHERE id = $1`,
      [userId],
    );
    const user = result.rows[0] ?? null;
    if (!user?.handle) {
      return res.status(400).json({ error: "Codeforces handle not linked" });
    }

    const data = await loadRevisionSolvesAndCache(userId);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    console.error("Revise controller error:", err);
    return res.status(500).json({ error: "Failed to fetch revision data" });
  }
};
