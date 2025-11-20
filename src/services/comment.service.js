import { Comment, Post, User } from "../models/index.js";
import { AppError } from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import userRoles from "../utils/userRoles.js";

// Service to create a new comment
export const createCommentService = async (content, postId) => {
  const userId = req.currentUser.id;
  if (!content || !postId)
    return next(new AppError("Fields are required", 400, httpStatusText.ERROR));
  const post = await Post.findByPk(postId);
  if (!post) throw new AppError("Post not found", 404, httpStatusText.ERROR);
  const comment = await Comment.create({
    content,
    postId,
    userId,
  });
  return comment;
};

// Service to get all comments, optionally filtered by postId
export const getAllCommentsService = async (postId) => {
  const filter = postId ? { where: { postId } } : {};
  const comments = await Comment.findAll({
    ...filter,
    include: [
      { model: User, attributes: ["id", "name", "email"] },
      { model: Post, attributes: ["id", "title"] },
    ],
    offset: req.query.offset ? parseInt(req.query.offset) : 0,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
  });
  if (!comments)
    throw new AppError("Comments not found", 404, httpStatusText.ERROR);
  return comments;
};

// Service to get a single comment by its ID
export const getCommentByIdService = async (id) => {
  const comment = Comment.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "email"],
      },
      {
        model: Post,
        attributes: ["id", "title"],
      },
    ],
  });
  if (!comment)
    throw new AppError("Comment not found", 404, httpStatusText.ERROR);
  return comment;
};

// Service to update a comment
export const updateCommentService = async (id, content) => {
  const userId = req.currentUser.id;

  const comment = await Comment.findByPk(id);
  if (!comment)
    throw new AppError("Comment not found", 404, httpStatusText.ERROR);
  if (comment.userId !== userId && req.currentUser.role !== userRoles.ADMIN)
    throw new AppError(
      "Not authorized to delete this comment",
      403,
      httpStatusText.ERROR
    );
  await comment.update({ content });

  return comment;
};

// Service to delete a comment
export const deleteCommentService = async (id) => {
  const userId = req.currentUser.user;
  const comment = await Comment.findByPk(id);

  if (!comment)
    throw new AppError(
      "Comment not found or deleted",
      404,
      httpStatusText.ERROR
    );
  if (comment.userId !== userId && req.currentUser.role !== userRoles.ADMIN)
    throw new AppError(
      "Not authorized to delete this comment",
      403,
      httpStatusText.ERROR
    );
  await comment.destroy();

  return;
};
