import { Request, Response } from "express";
import { signupWithHandle } from "../services/signup";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body;

    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }

    const user = await signupWithHandle(handle);

    return res.status(201).json({
      success: true,
      user
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || "Signup failed"
    });
  }
};
