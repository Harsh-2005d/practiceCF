import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { setUserHandle } from "../services/handle.service";

export const setHandleController = async (
  req: AuthedRequest,
  res: Response
) => {
  try {
    const { handle } = req.body;
    const { userId } = req.user!;

    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }

    const user = await setUserHandle(userId, handle);

    return res.status(200).json({
      success: true,
      handle: user.handle
    });
  } catch (err: any) {
    return res.status(400).json({
      error: err.message || "Failed to set handle"
    });
  }
};
