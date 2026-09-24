const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {getAdminStats, getAllUsers, getUserById, deleteUser} = require("../controllers/adminController");

router.use(protect);
router.use(isAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

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
