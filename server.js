import app from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import "./src/models/index.js";
import logger from "./src/config/logger.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    connectDB();

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server ${error}`);
    process.exit(1);
  }
};

startServer();
