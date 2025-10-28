import asyncWrapper from "../middlewares/asyncWrapper.js";
import { Post } from "../models/index.js";
import { AppError } from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createPost = asyncWrapper(async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user?.id;
  if (!userId) return next(new AppError("Unauthorized", 401));
  if (!title || !content) return next(new AppError("Fields are required"));
  const newPost = await Post.create({
    title,
    content,
    userId,
  });
  res.status(201).json({
    data: {
      status: httpStatusText.SUCCESS,
      post: newPost,
    },
  });
});

export const getAllPosts = asyncWrapper(async (req, res, next) => {
  const posts = await Post.findAll();
  if (!posts)
    return next(new AppError("No posts found", 404, httpStatusText.ERROR));
  res.status(200).json({ status: httpStatusText.SUCCESS, data: posts });
});

export const getSinglePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findByPk(id);
  if (!post)
    return next(new AppError("Post not found", 404, httpStatusText.FAIL));
  res.status(200).json({ status: httpStatusText.SUCCESS, data: post });
});

export const updatePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const post = await Post.findByPk(id);
  if (!post)
    return next(new AppError("Post not found", 404, httpStatusText.FAIL));
  if (post.userId !== req.currentUser.id)
    return next(new AppError("Unauthorized", 403, httpStatusText.FAIL));
  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();
  res.status(200).json({ status: httpStatusText.SUCCESS, data: post });
});

export const deletePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findByPk(id);
  if (!post)
    return next(new AppError("Post not found", 404, httpStatusText.FAIL));
  if (post.userId !== req.currentUser.id)
    return next(new AppError("Unauthorized", 403, httpStatusText.FAIL));
  await post.destroy();
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Post deleted successfully",
  });
});
