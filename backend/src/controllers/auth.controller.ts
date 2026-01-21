import { Request, Response } from "express";
import { googleOAuthLogin } from "../services/oauth.services";
import { AuthedRequest } from "../middleware/auth.middleware";
 

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing OAuth code");
    }
    // console.log("CALLBACK HIT");
    const { user, token } = await googleOAuthLogin(code);
    // console.log("redirecting");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in prod (https)
      sameSite: "lax",
    });
    // console.log("Redirecting to:", FRONTEND_URL);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/finish`
    );
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.status(401).send("Google OAuth failed");
  }
};

export const meController = (req: AuthedRequest, res: Response) => {
  return res.json(req.user);
};

export const logoutController = (_req: AuthedRequest, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in prod
  });
  return res.sendStatus(200);
};
