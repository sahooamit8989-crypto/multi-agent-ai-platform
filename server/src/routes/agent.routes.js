import express from "express";

import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent
} from "../controllers/agent.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create agent
router.post("/", authMiddleware, createAgent);

// Get all active agents
router.get("/", authMiddleware, getAgents);
router.get("/:id", authMiddleware, getAgentById);
router.put("/:id", authMiddleware, updateAgent);
router.delete("/:id", authMiddleware, deleteAgent);
export default router;