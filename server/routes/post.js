import express from "express";
const router = express.Router();
import { getPost, getPosts, updatePost, deletePost, addPost} from "../controllers/post.js";
import {verifyToken} from "../middleware/verifyToken.js"
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
export default router;