const User = require("../models/User");
const { options } = require("../routes/userRoutes");
const imagekit = require("../config/imagekit");



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

const searchUsers = async(req,res) => {
    try{
        const {skill,city,name,page=1,limit= 10,sort = "createdAt"} = req.query;

        let query = {};
        if(skill){
            query.skillsOffered = {
                $in: [skill]
            };
        }
        if(city){
            query.city = {
                $regex:city,
                $options: "i"
            }
        }
        if(name){
            query.name = {
                $regex: name,
                $options: "i"
            };
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber-1) * limitNumber;

        const totalUsers = await User.countDocuments(query);


        const sortOrder = req.query.order === "desc" ? -1 : 1;

        if(pageNumber<1 || limitNumber<1){
            return res.status(400).json({
                message: "page and limit must be greater than 0."
            });
        }


        const users = await User.find(query).select("-password").sort({ [sort]: sortOrder}).skip(skip).limit(limitNumber);
        res.status(200).json({
            currentPage: pageNumber,
            totalPage: Math.ceil(
                totalUsers/limitNumber
            ),
            totalUsers,
            users
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const uploadProfileImage = async(req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({
                message: "No image upload"
            });
        }

        const result = await imagekit.upload({
            file: req.file.buffer,

            fileName: `${Date.now()}-${req.file.originalname}`
        });

        req.user.profileImage = result.url;

        await req.user.save();

        res.status(200).json({
            message: "Profile image uploaded",
            image: result.url
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getProfile, updateProfile,getMatches, searchUsers, uploadProfileImage };