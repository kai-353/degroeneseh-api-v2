const express = require("express");
const {} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/");

module.exports = router;
