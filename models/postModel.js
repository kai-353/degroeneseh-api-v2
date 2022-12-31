const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    body: {
      type: String,
      required: [true, "Please add a body"],
    },
    posted_by_id: {
      type: mongoose.Types.ObjectId,
      required: [true, "No author ID specified"],
    },
    processed: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: Array,
      default: [],
    },
    category: {
      type: String,
      required: [true, "No category specified"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
