const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {sendMessage, getMessages} = require("../controllers/chatController");

router.post("/:userId", protect, sendMessage);

router.get("/:userId", protect, getMessages);

module.exports = router;