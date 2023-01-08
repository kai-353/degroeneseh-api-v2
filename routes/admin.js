const express = require("express");
const {
  notApproved,
  approvePost,
  deletePost,
  createFile,
  changePass,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminAuthMiddleware");
const router = express.Router();

router.get("/posts/notApproved", adminProtect, notApproved);

router.post("/approve/:id", adminProtect, approvePost);
router.post("/newFile", adminProtect, createFile);
router.post("/changePass", adminProtect, changePass);

router.delete("/posts/:id", adminProtect, deletePost);

module.exports = router;
