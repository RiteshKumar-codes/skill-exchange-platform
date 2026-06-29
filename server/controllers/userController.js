const User = require("../models/User");



const getProfile = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

const updateProfile = async (req, res) => {
    try {
        const {
            bio,
            city,
            skillsOffered,
            skillsWanted
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                message: "user not found"
            });
        }
        user.bio = bio || user.bio;
        user.city = city || user.city;

        if (skillsOffered) {
            user.skillsOffered = skillsOffered;
        }
        if (skillsWanted) {
            user.skillsWanted = skillsWanted;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated succesfully",

            user: updatedUser

        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getMatches = async (req,res) => {
    try{
        const currentUser = await User.findById(req.user._id);

        const users = await User.find({
           _id: {$ne: currentUser._id}
        }).select("-password");

        const matches = users.filter(user => {
            const canTeachMe = 
            currentUser.skillsWanted.some(skill =>
                user.skillsOffered.includes(skill)
            );

            const iCanTeach = 
            currentUser.skillsOffered.some(skill =>
                user.skillsWanted.includes(skill)
            );

            return canTeachMe && iCanTeach;
        });

        res.status(200).json({
            totalMatches:matches.length,
            matches
        });
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getProfile, updateProfile,getMatches };