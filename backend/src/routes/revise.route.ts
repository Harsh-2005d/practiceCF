import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { reviseController } from "../controllers/revise.controller";
import { setHandleController } from "../controllers/setHandler.controller";
const router = Router();

router.post("/handle", checkAuth, setHandleController);
router.get("/revise", checkAuth, reviseController);


export default router;
