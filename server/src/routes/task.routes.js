import express from "express";

import { executeAgent } from "../controllers/task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Execute an AI agent
router.post("/execute", authMiddleware, executeAgent);

export default router;