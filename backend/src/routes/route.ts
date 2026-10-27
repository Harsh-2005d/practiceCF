import { Router } from "express";
import authRoutes from "./auth.route";
import reviseRoutes from "./revise.route";
import blogRoutes from "./blog.route";

const router = Router();

// group routes
router.use(authRoutes);     // /signup, /login
router.use(reviseRoutes);   // /revise (protected)
router.use(blogRoutes);     // private user articles


export default router;
