import { prisma } from "../prismac";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { syncLast30DaysSolves } from "./cfSolveSync.service";
import { getUserInfo } from "./codeforces";

export const signup = async (email: string, password: string, handle: string) => {
  // 1. Validate CF handle
  const cfUser = await getUserInfo(handle);
  if (!cfUser) throw new Error("Codeforces handle does not exist");

  // 2. Check if email already exists
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) throw new Error("Email already registered");

  // 3. Check if handle already exists
  const handleExists = await prisma.user.findUnique({ where: { handle } });
  if (handleExists) throw new Error("Handle already registered");

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create user
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      password: hashedPassword,
      handle: cfUser.handle,
      rating: cfUser.rating ?? null
    }
  });

  // fire-and-forget initial sync if you want
  syncLast30DaysSolves(user.id, user.handle);

  const token = signToken({ userId: user.id, handle: user.handle });
  return { user, token };
};

// LOGIN (simple: by handle)
export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ userId: user.id, handle: user.handle });
  return { user, token };
};
