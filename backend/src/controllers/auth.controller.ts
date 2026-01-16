import { Request, Response } from "express";
import { signup, login } from "../services/auth.services";
import { googleOAuthLogin } from "../services/oauth.services";

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Missing OAuth code" });
    }

    const { user, token } = await googleOAuthLogin(code);

    return res.status(200).json({ user, token });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "Google OAuth failed" });
  }
};

