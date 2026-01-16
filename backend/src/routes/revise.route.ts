import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { reviseController } from "../controllers/revise.controller";
import { setHandleController } from "../controllers/setHandler.controller";
const router = Router();

router.post("/handle", requireAuth, setHandleController);
router.get("/revise", requireAuth, reviseController);

export default router;
