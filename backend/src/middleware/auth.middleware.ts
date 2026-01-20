import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../prismac";

export interface AuthedRequest extends Request {
  user?: {
    userId: string;   // 👈 KEEP YOUR ORIGINAL NAME
    handle?: string | null;
    email?: string;
    rating?: number | null;
  };
}

export const checkAuth = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token); // { userId: string }

    // 🔥 Load fresh user from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!dbUser) {
      return res.status(401).json({ error: "User not found" });
    }

    // ✅ PRESERVE YOUR ORIGINAL SHAPE
    req.user = {
      userId: dbUser.id,
      handle: dbUser.handle,
      email: dbUser.email,
      rating: dbUser.rating,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
