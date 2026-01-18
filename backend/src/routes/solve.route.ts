import { Router } from "express";
import { getSolves } from "../controllers/solve.controller";

const router = Router();

router.get("/solves", getSolves);

export default router;
