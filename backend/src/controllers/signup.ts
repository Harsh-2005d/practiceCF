import {prisma} from "../prismac"
import { getUserInfo } from "../middleware/codeforces";
import { randomUUID } from "crypto";
import { syncUserSolves } from "../jobs/syncSolves.job";


export const signupWithHandle = async (handle: string) => {
  // 1. Check if handle exists on Codeforces
  const cfUser = await getUserInfo(handle);

  if (!cfUser) {
    throw new Error("Codeforces handle does not exist");
  }

  // 2. Check if already in DB
  const existingUser = await prisma.user.findUnique({
    where: { handle }
  });

  if (existingUser) {
    throw new Error("User already registered");
  }

  // 3. Store user
  const newUser = await prisma.user.create({
    data: {
        id :randomUUID(),
        handle: cfUser.handle,
        rating: cfUser.rating ?? null,
    }
  });

  syncUserSolves(newUser.id, newUser.handle)
  return newUser;
};
