import express from "express";
import { getPost, addPost } from "../controllers/posts.js";
const router = express.Router();

router.get("/", getPost);
router.post("/", addPost);

export default router;