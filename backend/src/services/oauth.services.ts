import { prisma } from "../prismac";
import { randomUUID } from "crypto";
import { signToken } from "../utils/jwt";

type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
};

export const googleOAuthLogin = async (code: string) => {
  // 1. Exchange code → tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URL!
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error("Google OAuth token exchange failed");
  }

  // 2. Fetch user profile
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  const googleUser = (await userRes.json()) as GoogleUser;

  if (!googleUser.sub || !googleUser.email) {
    throw new Error("Invalid Google user data");
  }

  // 3. Find or create user in DB
  let user = await prisma.user.findUnique({
    where: { oauthId: googleUser.sub }
  });

  if (!user) {
    // Generate a handle (unique)
    const baseHandle = googleUser.email.split("@")[0];
    let handle = baseHandle;

    const exists = await prisma.user.findUnique({ where: { handle } });
    if (exists) {
      handle = `${baseHandle}_${Math.floor(Math.random() * 10000)}`;
    }

    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: googleUser.email,
        handle,
        rating: null,
        oauthProvider: "google",
        oauthId: googleUser.sub
      }
    });

    // Optional: initial sync
    // syncLast30DaysSolves(user.id, user.handle);
  }

  // 4. Issue your JWT
  const token = signToken({ userId: user.id, handle: user.handle });
  return { user, token };
};
