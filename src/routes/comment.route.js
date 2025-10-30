import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/").get(getAllComments).post(verifyToken, createComment);
router
  .route("/:id")
  .get(getCommentById)
  .put(verifyToken, updateComment)
  .delete(verifyToken, deleteComment);

export default router;
