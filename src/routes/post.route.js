import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/post.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/").post(verifyToken, createPost).get(verifyToken, getAllPosts);
router
  .route("/:id")
  .get(verifyToken, getSinglePost)
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost);

export default router;
