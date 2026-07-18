const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { getProfile, updateProfile,getMatches, searchUsers } = require("../controllers/userController");

router.get("/profile",protect,getProfile);
router.put("/profile",protect,updateProfile)
router.get("/matches",protect,getMatches)
router.get("/search",protect,searchUsers);

module.exports = router;