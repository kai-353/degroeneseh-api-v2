const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
  image_url: {
    type: String,
    required: [true, "Please add an img"],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  functie: {
    type: String,
    required: [true, "Please add a job"],
  },
  id: {
    type: Number,
    default: 2,
  },
});

module.exports = mongoose.model("Member", memberSchema);
