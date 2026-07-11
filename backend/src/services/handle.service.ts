import { prisma } from "../prismac";
import { getUserInfo } from "./codeforces";
import { syncLast30DaysSolves } from "./cfSolveSync.service";

export const setUserHandle = async (userId: string, handle: string) => {

  const result = await prisma.query(
  `
  SELECT *
  FROM "User"
  WHERE id = $1
  `,
  [userId]
);

const currentUser = result.rows[0] ?? null;
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
  const existing= await prisma.query(
  `
  SELECT *
  FROM "User"
  WHERE id = $1
  `,
  [userId]
);


  if (existing) {
    throw new Error("Handle already linked to another user");
  }

  // 3. Update user
  const res = await prisma.query(
  `
  UPDATE "User"
  SET
    handle = $1,
    rating = $2
  WHERE id = $3
  RETURNING *
  `,
  [
    cfUser.handle,
    cfUser.rating ?? null,
    userId,
  ]
);

const user = res.rows[0] ?? null;

  // 4. Fire-and-forget initial sync
  syncLast30DaysSolves(user.id, user.handle!);

  return user;
};
