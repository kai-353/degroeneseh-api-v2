const express = require("express");
const { getMembers, getFiles } = require("../controllers/documentController");
// const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/members", getMembers);
router.get("/files", getFiles);

module.exports = router;
