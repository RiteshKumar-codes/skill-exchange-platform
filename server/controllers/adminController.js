const User = require("../models/User");
const Session = require("../models/Session");
const Connection = require("../models/Connection");
const Review = require("../models/Review");

// get Dashboard stats

const getAdminStats = async (req,res) => {
    try{
         const [
            totalUsers,
            totalConnections,
            totalSessions,
            totalReviews
        ] = await Promise.all([
            User.countDocuments(),
            Connection.countDocuments(),
            Session.countDocuments(),
            Review.countDocuments()
        ]);
        res.status(200).json({
            success: true,
            stats:{
            totalUsers,
            totalSessions,
            totalConnections,
            totalReviews
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
};

// get all users

const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search
        } = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(
            Math.max(Number(limit), 1),
            100
        );

        const skip =
            (pageNumber - 1) * limitNumber;

        let query = {};

        if (search) {
            query = {
                $or: [
                    {
                        name: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            };
        }

        const [
            users,
            totalUsers
        ] = await Promise.all([
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            User.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            pagination: {
                currentPage: pageNumber,
                totalPages:
                    Math.ceil(
                        totalUsers / limitNumber
                    ),
                totalUsers,
                limit: limitNumber
            },
            users
        });

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Get single user
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

// delete user

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting themselves
        if (
            user._id.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    getUserById,
    deleteUser
};