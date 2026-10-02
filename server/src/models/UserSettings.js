import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark"
    },

    language: {
      type: String,
      default: "en"
    }
  },
  {
    timestamps: true
  }
);

const UserSettings = mongoose.model(
  "UserSettings",
  userSettingsSchema
);

export default UserSettings;