const express = require("express");
const { getMembers } = require("../controllers/documentController");
// const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/members", getMembers);

module.exports = router;
