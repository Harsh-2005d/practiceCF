import { syncLast30DaysSolves } from "../services/cfSolveSync.service";

export function syncUserSolves(
  userId: string,
  handle: string
) {
  void syncLast30DaysSolves(userId, handle)
    .catch(err => {
      console.error(
        `CF solve sync failed for user ${handle}:`,
        err
      );
    });
}
