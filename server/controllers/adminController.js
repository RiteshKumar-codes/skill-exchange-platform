const User = require("../models/User");
const Session = require("../models/Session");
const Connection = require("../models/Connection");
const Review = require("../models/Review");

// get Dashboard stats

const getStats = async (req,res) => {
    try{
        const totalUsers = await User.countDocuments();
        const totalSessions = await Session.countDocuments();
        const totalConnections = await Connection.countDocuments();
        const totalReviews = await Review.countDocuments();

        res.status(200).json({
            totalUsers,
            totalSessions,
            totalConnections,
            totalReviews
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

// get all users

const getAllUsers = async (req,res) => {
    try{
        const users = await User.find().select("-password");
        
        res.status(200).json({
            count: users.length,
            users
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

// delete user

const deleteuser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id);

        if(req.user._id.toString() === req.params.id){
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        if(!user){
          return res.status(404).json({
            message: "User not found"
          });
        }

        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {getStats, getAllUsers, deleteuser};