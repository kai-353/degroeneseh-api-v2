const mongoose = require("mongoose");

const categorieSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
});

module.exports = mongoose.model("Categorie", categorieSchema);
