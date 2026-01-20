import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getLast30DaysHistogram } from "../services/solveStats.service";

export const histogramController = async (
  req: AuthedRequest,
  res: Response
) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  

  const data = await getLast30DaysHistogram(req.user.userId);
  return res.json({ data });
};
