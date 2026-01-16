import { Router } from "express";
import authRoutes from "./auth.route";
import reviseRoutes from "./revise.route";

const router = Router();

// group routes
router.use(authRoutes);     // /signup, /login
router.use(reviseRoutes);   // /revise (protected)

export default router;
