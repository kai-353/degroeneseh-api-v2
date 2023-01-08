const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const File = require("../models/fileModel");

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

const createFile = expressAsyncHandler(async (req, res) => {
  const { url, name } = req.body;

  if (!url || !name) {
    res.status(400);
    throw new Error("No url/name provided");
  }

  const file = await File.create({ url, name });

  if (file) {
    res.status(201).json(file);
    return;
  }

  res.status(400);
  throw new Error("Invalid data");
});

const changePass = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please attach an email and a password");
  }

  const userExists = await User.find({ email: email });

  if (!userExists) {
    res.status(400);
    throw new Error("No user found with email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.updateOne(
    { email: email },
    { $set: { password: hashedPassword } }
  );

  if (user.modifiedCount == 0) {
    res.status(400);
    throw new Error("Password is the same");
  }

  res.status(200).json({ message: "Password succesfully changed" });
});

module.exports = {
  notApproved,
  approvePost,
  deletePost,
  createFile,
  changePass,
};
