import { Request, Response } from "express";
import { prisma } from "../prismac";

interface AuthedRequest extends Request {
  user?: {
    userId: string;   // 👈 KEEP YOUR ORIGINAL NAME
    handle?: string | null;
    email?: string;
    rating?: number | null;
  };
}
import { CodeforcesUser,CodeforcesResponse } from "../types/codeforces";

export const refreshController = async (req: AuthedRequest, res: Response) => {
  try {
    const user= req.user

    if (!user || !user.handle) {
      return res.status(400).json({ error: "Handle not set" });
    }

    // 2. Fetch CF info
    const cfRes = await fetch(
      `https://codeforces.com/api/user.info?handles=${user.handle}`
    );
    const cfData = <CodeforcesResponse<CodeforcesUser>> await cfRes.json();

    if (cfData.status !== "OK") {
      return res.status(400).json({ error: "Failed to fetch CF data" });
    }

    const cfUser = cfData.result[0];

    // 3. Update DB (mainly rating)
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        rating: cfUser.rating ?? null,
      },
    });

    return res.json({
      success: true,
      rating: updatedUser.rating,
      handle: cfUser.handle
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
