import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getPublicBlog,
  listPublicBlogs,
  listBlogs,
  updateBlog,
} from "../controllers/blog.controller";

const router = Router();

router.get("/feed", listPublicBlogs);
router.get("/feed/:id", getPublicBlog);
router.get("/blogs", checkAuth, listBlogs);
router.post("/blogs", checkAuth, createBlog);
router.get("/blogs/:id", checkAuth, getBlog);
router.put("/blogs/:id", checkAuth, updateBlog);
router.delete("/blogs/:id", checkAuth, deleteBlog);

export default router;
