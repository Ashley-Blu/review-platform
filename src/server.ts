// src/server.ts
import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import projectsRoutes from "./routes/platformRoutes";
import submissionsRoutes from "./routes/submissionRoutes";
import commentsRoutes from "./routes/commentsRoutes";

import { testDbConnection } from "./config/database";
import { initSocket } from "./utils/socket";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/comments", commentsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function start() {
  try {
    await testDbConnection();
    const io = initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
