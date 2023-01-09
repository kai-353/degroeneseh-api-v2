const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, password2, functie, ziekenhuis } = req.body;

  if (!name || !email || !password || !password2 || !functie) {
    res.status(400);
    throw new Error("Vul aub alle velden in");
  }

  if (password !== password2) {
    res.status(400);
    throw new Error("Wachtwoorden matchen niet");
  }

  if (name.length < 5) {
    res.status(400);
    throw new Error("Naam moet minimaal 5 karakters lang zijn");
  }

  // Check if user exists
  const userExistsEmail = await User.findOne({ email });
  const userExistsName = await User.findOne({ name });

  if (userExistsEmail) {
    res.status(400);
    throw new Error("Email is al geregistreerd");
  }

  if (userExistsName) {
    res.status(400);
    throw new Error("Naam is al geregistreerd");
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
    ziekenhuis,
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

const changeImageURL = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400);
    throw new Error("No url found in body");
  }

  const user = await User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        image_url: url,
      },
    }
  );

  if (user) {
    if (user.matchedCount == 0) {
      res.status(400);
      throw new Error("User doesn't exist");
    }
    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const addFav = asyncHandler(async (req, res) => {
  const { pid } = req.body;

  if (!pid) {
    res.status(400);
    throw new Error("No post id found in body");
  }

  const user = await User.updateOne(
    { _id: req.user._id },
    {
      $push: {
        favorites: pid,
      },
    }
  );

  if (user) {
    if (user.matchedCount == 0) {
      res.status(400);
      throw new Error("User doesn't exist");
    }
    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const remFav = asyncHandler(async (req, res) => {
  const { pid } = req.body;

  if (!pid) {
    res.status(400);
    throw new Error("No post id found in body");
  }

  const user = await User.updateOne(
    { _id: req.user._id },
    {
      $pull: {
        favorites: pid,
      },
    }
  );

  if (user) {
    if (user.matchedCount == 0) {
      res.status(400);
      throw new Error("User doesn't exist");
    }
    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const updateMe = asyncHandler(async (req, res) => {
  const { name, functie, ziekenhuis } = req.body;

  if (!name || !functie || !ziekenhuis) {
    res.status(400);
    throw new Error("Please send all fields");
  }

  if (name.length < 5) {
    res.status(400);
    throw new Error("Naam moet minimaal 5 karakters lang zijn");
  }

  const userExists = await User.findOne()
    .where("name")
    .equals(name)
    .where("_id")
    .ne(req.user._id);

  if (userExists) {
    res.status(400);
    throw new Error("Naam bestaat al");
  }

  const user = await User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        name,
        functie,
        ziekenhuis,
      },
    }
  );

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { password, password2 } = req.body;

  if (!password || !password2) {
    res.status(400);
    throw new Error("Please send all fields");
  }

  const userExists = await User.findById(req.user._id);

  if (userExists && (await bcrypt.compare(password, userExists.password))) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password2, salt);

    const user = await User.updateOne(
      { _id: req.user._id },
      {
        $set: { password: hashedPassword },
      }
    );

    if (user.modifiedCount == 0) {
      res.status(400);
      throw new Error("Password is the same");
    }

    res.status(200).json({ message: "Password succesfully changed" });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
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
  changeImageURL,
  addFav,
  remFav,
  updateMe,
  updatePassword,
};
