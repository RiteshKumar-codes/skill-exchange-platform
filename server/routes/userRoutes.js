const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { getProfile, updateProfile,getMatches, searchUsers, uploadProfileImage } = require("../controllers/userController");

router.get("/profile",protect,getProfile);
router.put("/profile",protect,updateProfile)
router.get("/matches",protect,getMatches)
router.get("/search",protect,searchUsers);
router.put("/profile/image",protect,upload.single("image"),uploadProfileImage);

module.exports = router;