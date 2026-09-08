const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {getStats, getAllUsers, deleteuser} = require("../controllers/adminController");

router.get("/stats",protect,isAdmin,getStats);
router.get("/users",protect,isAdmin,getAllUsers);
router.delete("/users/:id",protect,isAdmin,deleteuser);
router.get("/dashboard", protect, authorizeRoles("admin"), (req, res) => {
    res.status(200).json({
        message: "Welcome to Admin Dashboard",
        admin: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;
