import { Request, Response } from "express";
import { googleOAuthLogin } from "../services/oauth.services";

const FRONTEND_URL = "http://localhost:5173"; // your Vite frontend

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing OAuth code");
    }

    const { user, token } = await googleOAuthLogin(code);


    return res.redirect(
      `${FRONTEND_URL}/auth/finish?token=${token}`
    );
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.status(401).send("Google OAuth failed");
  }
};
