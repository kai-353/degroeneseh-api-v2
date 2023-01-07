const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  url: {
    type: String,
    required: [true, "Please add an URL"],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
});

module.exports = mongoose.model("File", fileSchema);
