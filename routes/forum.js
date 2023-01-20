const express = require("express");
const {
  newPost,
  newComment,
  getPost,
  getPosts,
  getCategories,
  getAmountOfPosts,
  getMyPosts,
  getFavorites,
  changePost,
  deletePost,
} = require("../controllers/forumController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/posts/new", protect, newPost);
router.post("/posts/new_comment", protect, newComment);
router.post("/posts/change/:id", protect, changePost);

router.get("/posts", getPosts);
router.get("/posts/:id", getPost);
router.get("/categories", getCategories);
router.get("/post_count", getAmountOfPosts);
router.get("/myposts", protect, getMyPosts);
router.get("/favorites", protect, getFavorites);

router.delete("/posts/:id", protect, deletePost);

module.exports = router;
