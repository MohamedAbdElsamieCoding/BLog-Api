import { where } from "sequelize";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { Comment, Post, User } from "../models/index.js";
import { AppError } from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import userRoles from "../utils/userRoles.js";

export const createComment = asyncWrapper(async (req, res, next) => {
  const { content, postId } = req.body;
  const userId = req.currentUser.id;
  if (!content || !postId)
    return next(new AppError("Fields are required", 400, httpStatusText.ERROR));
  const post = await Post.findByPk(postId);
  if (!post)
    return next(new AppError("Post not found", 404, httpStatusText.ERROR));
  const comment = await Comment.create({
    content,
    postId,
    userId,
  });
  res.status(201).json({ status: httpStatusText.SUCCESS, data: comment });
});

export const getAllComments = asyncWrapper(async (req, res, next) => {
  const { postId } = req.params;
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
    return next(new AppError("Comments not found", 404, httpStatusText.ERROR));
  res.status(200).json({ status: httpStatusText.SUCCESS, data: comments });
});

export const getCommentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
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
    return next(new AppError("Comment not found", 404, httpStatusText.ERROR));
  res.status(200).json({ status: httpStatusText.SUCCESS, data: comment });
});

export const updateComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.currentUser.id;

  const comment = await Comment.findByPk(id);
  if (!comment)
    return next(new AppError("Comment not found", 404, httpStatusText.ERROR));
  if (comment.userId !== userId && req.currentUser.role !== userRoles.ADMIN)
    return next(
      new AppError(
        "Not authorized to delete this comment",
        403,
        httpStatusText.ERROR
      )
    );
  await comment.update({ content });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { comment } });
});

export const deleteComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.currentUser.user;
  const comment = await Comment.findByPk(id);

  if (!comment)
    return next(
      new AppError("Comment not found or deleted", 404, httpStatusText.ERROR)
    );
  if (comment.userId !== userId && req.currentUser.role !== userRoles.ADMIN)
    return next(
      new AppError(
        "Not authorized to delete this comment",
        403,
        httpStatusText.ERROR
      )
    );
  await comment.destroy();
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: "Comment deleted successfully",
  });
});
