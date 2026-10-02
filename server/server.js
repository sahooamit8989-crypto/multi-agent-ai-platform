import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import agentRoutes from "./src/routes/agent.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Multi-Agent AI Platform Server is running"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chats", chatRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});