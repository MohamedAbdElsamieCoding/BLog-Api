import onFinished from "on-finished";
import logger from "../config/logger.js";
import httpStatusText from "../utils/httpStatusText.js";
import { randomUUID } from "crypto";

export const requestLogger = (req, res, next) => {
  //creating id for any user
  const requestId = randomUUID();
  req.id = requestId;
  res.setHeader("x-Request-Id", requestId);
  //--------------------------------------------------
  const start = Date.now();

  logger.http(
    `[${requestId}] incoming -> ${req.method} , ${req.originalUrl} from ${req.ip}`
  );

  onFinished(res, () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusType =
      status >= 400 ? httpStatusText.ERROR : httpStatusText.SUCCESS;
    const logMessage = `[${requestId}] Completed -> ${req.method} ${req.originalUrl} | ${statusType} (${status}) | ${duration}ms`;
    if (status >= 400) {
      logger.error(logMessage);
    } else {
      logger.http(logMessage);
    }
  });
  next();
};
