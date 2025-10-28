import { User } from "../models/index.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import logger from "../config/logger.js";
import bcrypt from "bcrypt";
import generateJwt from "../utils/generateJWT.js";

export const register = asyncWrapper(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "Fields are required" });
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });
  res.status(201).json({ message: "user created successfully", newUser });
});

export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (email && matchedPassword) {
    const token = generateJwt({
      role: user.role,
      id: user.id,
    });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

export const getAllUsers = asyncWrapper(async (req, res) => {
  const allUsers = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (!allUsers) {
    res.status(404).json({ message: "No users found" });
  }
  res.status(200).json({ data: allUsers });
});

export const getSingleUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ data: user });
});

export const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const deleted = await User.destroy({ where: { id } });
  if (!deleted)
    return res
      .status(404)
      .json({ message: "User not found or already deleted" });
  res.status(200).json({ message: "User deleted successfully" });
});
