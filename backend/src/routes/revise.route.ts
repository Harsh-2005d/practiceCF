import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { reviseController } from "../controllers/revise.controller";

const router = Router();

router.get("/revise", requireAuth, reviseController);

export default router;
