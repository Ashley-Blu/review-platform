import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.use(express.json());
  // Application routes

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
startServer();
