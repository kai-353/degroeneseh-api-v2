const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getId,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, getMe);
router.get("/:id", getId);

module.exports = router;
