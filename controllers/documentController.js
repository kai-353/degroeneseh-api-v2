const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel");
const mongoose = require("mongoose");

const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().sort("id");
  res.status(200).json(members);
});

module.exports = {
  getMembers,
};
