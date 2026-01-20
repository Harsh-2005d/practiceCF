import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { reviseController } from "../controllers/revise.controller";
import { setHandleController } from "../controllers/setHandler.controller";
import { histogramController } from "../controllers/stats.controller";
import {refreshController } from "../controllers/refresh.controller"
const router = Router();

router.post("/handle", checkAuth, setHandleController);
router.get("/revise", checkAuth, reviseController);
router.get("/stats/histogram", checkAuth, histogramController);
router.get("/refresh/user", checkAuth, refreshController);



export default router;
