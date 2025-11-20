import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  createCommentService,
  deleteCommentService,
  getAllCommentsService,
  getCommentByIdService,
  updateCommentService,
} from "../services/comment.service.js";
import httpStatusText from "../utils/httpStatusText.js";

// Controller to handle comment creation
export const createComment = asyncWrapper(async (req, res, next) => {
  const { content, postId } = req.body;
  const comment = await createCommentService(content, postId);
  res.status(201).json({ status: httpStatusText.SUCCESS, data: comment });
});

// Controller to get all comments, optionally filtered by postId
export const getAllComments = asyncWrapper(async (req, res, next) => {
  const { postId } = req.params;
  const comments = await getAllCommentsService(postId);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: comments });
});

// Controller to get a single comment by its ID
export const getCommentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const comment = await getCommentByIdService(id);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: comment });
});

// Controller to update a comment
export const updateComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await updateCommentService(id, content);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { comment } });
});

// Controller to delete a comment
export const deleteComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  await deleteCommentService(id);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: "Comment deleted successfully",
  });
});
