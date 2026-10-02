import Chat from "../models/Chat.js";
import Agent from "../models/Agent.js";

// CREATE CHAT
export const createChat = async (req, res) => {
  try {
    const { agentId, title } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required",
      });
    }

    const agent = await Agent.findOne({
      _id: agentId,
      isActive: true,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const chat = await Chat.create({
      userId: req.user.userId,
      agentId,
      title: title || "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET USER CHATS
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user.userId,
    })
      .populate("agentId", "name type")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET SINGLE CHAT
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findOne({
      _id: id,
      userId: req.user.userId,
    }).populate("agentId", "name description type");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE CHAT
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};