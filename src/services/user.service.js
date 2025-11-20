import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import generateJwt from "../utils/generateJWT.js";
import { AppError } from "../utils/appError.js";

// Service to handle user registration
export const registerService = async (name, email, password, role) => {
  if (!name || !email || !password)
    throw new AppError("Fields are required", 400);

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new AppError("Email already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  return newUser;
};

// Service to handle user login
export const loginService = async (email, password) => {
  if (!email || !password)
    throw new AppError("Email and password are required", 400);

  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", 400);

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) throw new AppError("Invalid email or password", 400);

  const token = generateJwt({
    role: user.role,
    id: user.id,
  });
  return { token, user };
};

// Service to get all users
export const getAllUsersService = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (users.length === 0) {
    throw new AppError("No users found", 404);
  }
  return users;
};

// Service to get a single user by ID
export const getSingleUserService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const deleteUserService = async (id) => {
  const deleted = await User.destroy({ where: { id } });
  if (!deleted) throw new AppError("User not found or already deleted", 404);
};
