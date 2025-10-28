import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText.js";
import { AppError } from "../utils/appError.js";
import asyncWrapper from "./asyncWrapper.js";

const verifyToken = asyncWrapper(async (req, res, next) => {
  const authHeaders =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeaders)
    return next(new AppError("token is required", 401, httpStatusText.ERROR));
  const token = authHeaders.split(" ")[1];
  const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.currentUser = currentUser;
  next();
});
export default verifyToken;
