const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const adminProtect = asyncHandler(async (req, res, next) => {
  if (req.query.password && req.query.password == "adminwachtwoord123") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
});

module.exports = { adminProtect };
