import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    systemPrompt: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "coding",
        "research",
        "writing",
        "data",
        "general"
      ],
      default: "general"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;