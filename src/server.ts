import express from "express";
import dotenv from "dotenv";
import { testDbConnection } from "./config/database";
import applicationRoutes from "./routes/applicationRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testDbConnection(); // connect to DB first
  app.use(express.json());
  // Application routes
  app.use('/api', applicationRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
startServer();
