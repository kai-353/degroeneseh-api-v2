const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Post = require("../models/postModel");

const notApproved = expressAsyncHandler(async (req, res) => {
  const posts = await Post.find({ processed: false });

  res.status(200).json(posts);
});

const approvePost = expressAsyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  const post = await Post.updateOne(
    { _id: req.params.id },
    {
      $set: { processed: true },
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

const deletePost = expressAsyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  await Post.deleteOne({ _id: req.params.id });

  res.status(204).json({ message: "Post deleted succesfully" });
});

module.exports = {
  notApproved,
  approvePost,
  deletePost,
};
