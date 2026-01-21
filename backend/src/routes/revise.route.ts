import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { reviseController } from "../controllers/revise.controller";
import { setHandleController } from "../controllers/setHandler.controller";
import { histogramController } from "../controllers/stats.controller";
import {refreshController } from "../controllers/refresh.controller"
import { runDailyCfSyncJob } from "../jobs/dailySync.job";
const router = Router();

router.post("/handle", checkAuth, setHandleController);
router.get("/revise", checkAuth, reviseController);
router.get("/stats/histogram", checkAuth, histogramController);
router.get("/refresh/user", checkAuth, refreshController);
router.post("/sync", async (req, res) => {
  console.log("recieved")
  if (req.headers["cron-secret"] !== process.env.CRON_SECRET) {
    return res.status(401).end();
  }
  console.log("verified")
  await runDailyCfSyncJob();
  console.log("done")
  res.json({ success: true });
});

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;
