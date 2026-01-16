import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getRevisionSolves } from "../services/revise.service";
import {prisma} from "../prismac"
export const reviseController = async (req: AuthedRequest, res: Response) => {
  try {
    const { userId} = req.user!; // from JWT

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { handle: true }
    });

    if (!user?.handle) {
      return res.status(400).json({
        error: "Codeforces handle not linked"
      });
    }
    const data = await getRevisionSolves(userId);

    return res.status(200).json({
      success: true,
      previousDay: data.previousDay,
      previousWeek: data.previousWeek,
      previousMonth: data.previousMonth
    });
  } catch (err) {
    console.error("Revise controller error:", err);
    return res.status(500).json({ error: "Failed to fetch revision data" });
  }
};
