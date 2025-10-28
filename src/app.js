import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

export default app;
