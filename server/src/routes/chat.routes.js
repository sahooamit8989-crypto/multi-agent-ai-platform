import express from "express";

import {
  createChat,
  getChats,
  getChatById,
  deleteChat,
} from "../controllers/chat.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new chat
router.post("/", authMiddleware, createChat);

// Get all chats for logged-in user
router.get("/", authMiddleware, getChats);

// Get one chat
router.get("/:id", authMiddleware, getChatById);

// Delete one chat
router.delete("/:id", authMiddleware, deleteChat);

export default router;