import { prisma } from "../prismac";
import { getUserInfo } from "./codeforces";
import { syncLast30DaysSolves } from "./cfSolveSync.service";

export const setUserHandle = async (userId: string, handle: string) => {

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (currentUser.handle) {
    throw new Error("Handle already set and cannot be changed");
  }
  
  // 1. Verify CF handle exists
  const cfUser = await getUserInfo(handle);
  if (!cfUser) {
    throw new Error("Codeforces handle does not exist");
  }

  // 2. Ensure handle not already taken
  const existing = await prisma.user.findUnique({
    where: { handle }
  });

  if (existing) {
    throw new Error("Handle already linked to another user");
  }

  // 3. Update user
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      handle: cfUser.handle,
      rating: cfUser.rating ?? null
    }
  });

  // 4. Fire-and-forget initial sync
  syncLast30DaysSolves(user.id, user.handle!);

  return user;
};
