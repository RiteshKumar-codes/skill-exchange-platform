const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {getStats, getAllUsers, deleteuser} = require("../controllers/adminController");

router.get("/stats",protect,isAdmin,getStats);
router.get("/users",protect,isAdmin,getAllUsers);
router.delete("/users/:id",protect,isAdmin,deleteuser);

module.exports = router;
