import { AppError } from "../utils/appError.js";

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role)
      return next(new AppError("User role not found"));
    const userRole = req.user.role;
    const allowedRoles = roles;
    if (!allowedRoles.includes(userRole))
      return next(new AppError("Not allowed", 403, httpStatusText.FAIL));
  };
};
