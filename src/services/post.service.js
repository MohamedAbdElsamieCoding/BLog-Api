import { Post } from "../models/index.js";
import { AppError } from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

// Service to create a new post
export const createPostService = async (title, content, userId) => {
  if (!userId) throw new AppError("Unauthorized", 401);
  if (!title || !content) throw new AppError("Fields are required");
  const newPost = await Post.create({
    title,
    content,
    userId,
  });
  return newPost;
};

// Service to get all posts
export const getAllPostsService = async () => {
  const posts = await Post.findAll();
  if (!posts) throw new AppError("No posts found", 404, httpStatusText.ERROR);
  return posts;
};

// Service to get a single post by ID
export const getSinglePostService = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError("Post not found", 404, httpStatusText.FAIL);
  return post;
};

// Service to update a post
export const updatePostService = async (title, content, id, userId) => {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError("Post not found", 404, httpStatusText.FAIL);
  if (post.userId !== userId)
    throw new AppError("Unauthorized", 403, httpStatusText.FAIL);
  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();
  return post;
};

// Service to delete a post
export const deletePostService = async (id, userId) => {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError("Post not found", 404, httpStatusText.FAIL);
  if (post.userId !== userId)
    throw new AppError("Unauthorized", 403, httpStatusText.FAIL);
  await post.destroy();
  return;
};
