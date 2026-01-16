import { Request, Response } from "express";
import { signup, login } from "../services/auth.services";
import { googleOAuthLogin } from "../services/oauth.services";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { email, password, handle } = req.body;
    if (!email || !password || !handle) {
      return res.status(400).json({ error: "Email, password, and handle required" });
    }

    const { user, token } = await signup(email, password, handle);
    return res.status(201).json({ user, token });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Signup failed" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { user, token } = await login(email, password);
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "Login failed" });
  }
};



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

