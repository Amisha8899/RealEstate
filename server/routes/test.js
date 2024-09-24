import express from "express";
import { loggedIn, admin } from "../controllers/test.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
router.get("/loggedIn", verifyToken, loggedIn);
router.get("/admin", admin);
export default router;