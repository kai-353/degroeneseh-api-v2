const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const Categorie = require("../models/categorieModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");
moment.locale("nl");

const newPost = asyncHandler(async (req, res) => {
  const { title, body, category } = req.body;

  if (!title || !body || !category) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const post = await Post.create({
    title,
    body,
    category,
    posted_by_id: req.user._id,
  });

  if (post) {
    res.status(201).json(post);
    return;
  }

  res.status(400);
  throw new Error("Invalid data");
});

const newComment = asyncHandler(async (req, res) => {
  const { body, id } = req.body;

  if (!body || !id) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  const post = await Post.updateOne(
    { _id: id, processed: true },
    {
      $push: {
        comments: {
          body,
          posted_by_id: req.user._id,
          createdAt: Date.now(),
        },
      },
    }
  );

  if (post) {
    if (post.matchedCount == 0) {
      res.status(400);
      throw new Error("Post doesn't exist");
    }

    res.status(201).json(post);
  } else {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const getPosts = asyncHandler(async (req, res) => {
  const { page } = req.query;

  if (!page || !page == typeof "number" || !(page > 0)) {
    res.status(400);
    throw new Error("Please add a (valid) page number");
  }

  const posts = await Post.find()
    .where("processed")
    .equals(true)
    .skip((page - 1) * 6)
    .limit(6)
    .select("-processed")
    .select("-comments")
    .sort("-createdAt");

  const postArray = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const user = await User.findById(post.posted_by_id);

    postArray.push({
      _id: post._id,
      title: post.title,
      body: post.body,
      posted_by_id: post.posted_by_id,
      posted_by: user.name,
      category: post.category,
      createdAt: moment(post.createdAt).fromNow(),
      image_url: user.image_url,
    });
  }

  res.status(200).json(postArray);
});

const getPost = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error("Post bestaat niet");
  }

  const user = await User.findById(post.posted_by_id);

  const alteredPost = {
    _id: post._id,
    title: post.title,
    body: post.body,
    posted_by_id: post.posted_by_id,
    posted_by: user.name,
    createdAt: moment(post.createdAt).fromNow(),
    image_url: user.image_url,
    processed: post.processed,
    category: post.category,
    comments: [],
  };

  for (let i = 0; i < post.comments.length; i++) {
    const comment = post.comments[i];

    const comment_author = await User.findById(comment.posted_by_id);

    alteredPost.comments.push({
      body: comment.body,
      posted_by_id: comment.posted_by_id,
      posted_by: comment_author.name,
      createdAt: moment(comment.createdAt).fromNow(),
      image_url: comment_author.image_url,
    });
  }

  if (post.processed) {
    res.status(200).json(alteredPost);
    return;
  }

  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      throw new Error("");
    }

    const token = bearer.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findById(decoded.id).select("-password");

    if (user && user._id.toString() == post.posted_by_id.toString()) {
      res.status(200).json(alteredPost);
      return;
    }
  } catch (error) {}

  res.status(403);
  throw new Error("Post is nog niet goedgekeurd");
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Categorie.find();

  res.status(200).json(categories.map((x) => x.title));
});

const getAmountOfPosts = asyncHandler(async (req, res) => {
  const amount = await Post.count({ processed: true });
  res.status(200).json({ count: amount });
});

const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .where("posted_by_id")
    .equals(req.user._id)
    .select("-comments")
    .sort("-createdAt");

  res.status(200).json(posts);
});

module.exports = {
  newPost,
  newComment,
  getPost,
  getPosts,
  getCategories,
  getAmountOfPosts,
  getMyPosts,
};
