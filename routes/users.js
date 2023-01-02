const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getId,
  changeImageURL,
  addFav,
  remFav,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/updateImageUrl", protect, changeImageURL);
router.post("/addFavorite", protect, addFav);
router.post("/removeFavorite", protect, remFav);

router.get("/me", protect, getMe);
router.get("/:id", getId);

module.exports = router;
