import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  createPostService,
  getAllPostsService,
  getSinglePostService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import httpStatusText from "../utils/httpStatusText.js";

// Controller to handle post creation
export const createPost = asyncWrapper(async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.currentUser.id;
  const newPost = createPostService(title, content, userId);
  res.status(201).json({
    data: {
      status: httpStatusText.SUCCESS,
      post: newPost,
    },
  });
});

// Controller to get all posts
export const getAllPosts = asyncWrapper(async (req, res, next) => {
  const posts = await getAllPostsService();
  res.status(200).json({ status: httpStatusText.SUCCESS, data: posts });
});

// Controller to get a single post by ID
export const getSinglePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const post = await getSinglePostService(id);

  res.status(200).json({ status: httpStatusText.SUCCESS, data: post });
});

// Controller to update a post
export const updatePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.currentUser.id;
  const post = await updatePostService(title, content, id, userId);

  res.status(200).json({ status: httpStatusText.SUCCESS, data: post });
});

// Controller to delete a post
export const deletePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.currentUser.id;
  await deletePostService(id, userId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Post deleted successfully",
  });
});
