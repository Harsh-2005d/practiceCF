import { Router, Request, Response } from "express";

import { signupWithHandle } from "../controllers/signup";
const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "server not dead yet" });
});

router.post("/signup", async (req: Request, res: Response) => {
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
});

export default router;
