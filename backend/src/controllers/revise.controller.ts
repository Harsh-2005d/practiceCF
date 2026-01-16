import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";

export const reviseController = async (req: AuthedRequest, res: Response) => {
  // Guaranteed by middleware
  const { userId, handle } = req.user!;

  // Use handle directly for processing
  // e.g. trigger something, fetch data, etc.

  return res.status(200).json({
    success: true,
    message: "Protected revise endpoint hit",
    userId,
    handle
  });
};
