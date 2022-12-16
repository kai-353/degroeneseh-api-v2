const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, password2, functie } = req.body;

  if (!name || !email || !password || !password2 || !functie) {
    res.status(400);
    throw new Error("Vul aub alle velden in");
  }

  if (password !== password2) {
    res.status(400);
    throw new Error("Wachtwoorden matchen niet");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email is al geregistreerd");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    functie,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      functie: user.functie,
      image_url: user.image_url,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && password && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      functie: user.functie,
      image_url: user.image_url,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.user._id)
    .select("-approved")
    .select("-password");
  res.status(200).json(user);
});

const getId = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("ID not valid");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  res.status(200).json({
    _id: user.id,
    name: user.name,
    functie: user.functie,
    image_url: user.image_url,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getId,
};
