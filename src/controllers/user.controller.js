import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  registerService,
  loginService,
  getAllUsersService,
  getSingleUserService,
  deleteUserService,
} from "../services/user.service.js";
import httpStatusText from "../utils/httpStatusText.js";

// Controller to handle user registration
export const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const newUser = await registerService(name, email, password, role);

  res.status(201).json({ status: httpStatusText.SUCCESS, data: newUser });
});

// Controller to handle user login
export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const token = await loginService(email, password);

  res.status(200).json({ status: httpStatusText.SUCCESS, data: token });
});

// Controller to get all users
export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await getAllUsersService();

  res.status(200).json({ status: httpStatusText.SUCCESS, data: users });
});

// Controller to get a single user by ID
export const getSingleUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await getSingleUserService(id);

  res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
});

// Controller to delete a user by ID
export const deleteUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  await deleteUserService(id);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: "User deleted successfully",
  });
});
