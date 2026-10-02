import Agent from "../models/Agent.js";

// CREATE AGENT
export const createAgent = async (req, res) => {
  try {
    const {
      name,
      description,
      systemPrompt,
      type
    } = req.body;

    if (!name || !description || !systemPrompt) {
      return res.status(400).json({
        success: false,
        message: "Name, description and system prompt are required"
      });
    }

    const agent = await Agent.create({
      name,
      description,
      systemPrompt,
      type
    });

    res.status(201).json({
      success: true,
      message: "Agent created successfully",
      agent
    });

  } catch (error) {
    console.error("Create Agent Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// GET ALL AGENTS
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({
      isActive: true
    }).select("-systemPrompt");

    res.status(200).json({
      success: true,
      count: agents.length,
      agents
    });

  } catch (error) {
    console.error("Get Agents Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// GET SINGLE AGENT
export const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findOne({
      _id: id,
      isActive: true
    }).select("-systemPrompt");

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    res.status(200).json({
      success: true,
      agent
    });

  } catch (error) {
    console.error("Get Agent Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// UPDATE AGENT
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      systemPrompt,
      type,
      isActive
    } = req.body;

    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    if (name !== undefined) {
      agent.name = name;
    }

    if (description !== undefined) {
      agent.description = description;
    }

    if (systemPrompt !== undefined) {
      agent.systemPrompt = systemPrompt;
    }

    if (type !== undefined) {
      agent.type = type;
    }

    if (isActive !== undefined) {
      agent.isActive = isActive;
    }

    await agent.save();

    res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      agent
    });

  } catch (error) {
    console.error("Update Agent Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// DEACTIVATE AGENT
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    agent.isActive = false;

    await agent.save();

    res.status(200).json({
      success: true,
      message: "Agent deactivated successfully"
    });

  } catch (error) {
    console.error("Delete Agent Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};