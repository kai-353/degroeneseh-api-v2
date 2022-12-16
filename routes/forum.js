const express = require("express");
const {
  newPost,
  newComment,
  getPost,
  getPosts,
  getCategories,
  getAmountOfPosts,
  getMyPosts,
} = require("../controllers/forumController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/posts/new", protect, newPost);
router.post("/posts/new_comment", protect, newComment);

router.get("/posts", getPosts);
router.get("/posts/:id", getPost);
router.get("/categories", getCategories);
router.get("/post_count", getAmountOfPosts);
router.get("/myposts", protect, getMyPosts);

module.exports = router;
