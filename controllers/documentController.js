const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel");
const File = require("../models/fileModel");
const mongoose = require("mongoose");

const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().sort("id");
  res.status(200).json(members);
});

const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find();
  res.status(200).json(files);
});

module.exports = {
  getMembers,
  getFiles,
};
