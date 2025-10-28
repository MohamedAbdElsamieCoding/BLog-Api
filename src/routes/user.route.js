import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  login,
  register,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/").get(getAllUsers);
router.route("/:id").get(getSingleUser).delete(deleteUser);

export default router;
