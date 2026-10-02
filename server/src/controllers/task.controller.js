import Agent from "../models/Agent.js";
import Chat from "../models/Chat.js";
import { generateAIResponse } from "../services/ai/ai.service.js";

export const executeAgent = async (req, res) => {
  try {
    const { agentId, chatId, message } = req.body;

    if (!agentId || !chatId || !message) {
      return res.status(400).json({
        success: false,
        message: "Agent ID, chat ID and message are required",
      });
    }

    // Find active agent
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

    // Find chat belonging to logged-in user
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.userId,
      agentId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: message,
    });

    await chat.save();

    // Generate AI response
    const aiResponse = await generateAIResponse({
      systemPrompt: agent.systemPrompt,
      userMessage: message,
      agentType: agent.type,
    });

    const assistantMessage =
      aiResponse?.response ||
      "I could not generate a response.";

    // Save AI response
    chat.messages.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Automatically create a useful title
    if (
      chat.title === "New Chat" &&
      chat.messages.length === 2
    ) {
      chat.title =
        message.length > 50
          ? `${message.substring(0, 50)}...`
          : message;
    }

    await chat.save();

    res.status(200).json({
      success: true,

      agent: {
        id: agent._id,
        name: agent.name,
        type: agent.type,
      },

      chatId: chat._id,

      result: aiResponse,
    });
  } catch (error) {
    console.error("Execute Agent Error:", error);

    res.status(500).json({
      success: false,
      message: "Agent execution failed",
    });
  }
};