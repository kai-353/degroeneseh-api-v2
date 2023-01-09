const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    functie: {
      type: String,
      required: false,
    },
    ziekenhuis: {
      type: String,
      default: "",
    },
    image_url: {
      type: String,
      default: "/default_image.png",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    favorites: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
