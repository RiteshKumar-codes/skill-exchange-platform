const Review = require("../models/Review");
const User = require("../models/User");

const createReview = async (req, res) => {
    try {
        const {
            reviewee,
            rating,
            comment
        } = req.body;

        const review = await Review.create({
            reviewer: req.user._id,
            reviewee,
            rating,
            comment
        });

        await Notification.create({
            recipient: reviewee,
            message: "You recieved a new review",
            type: "review"
        });

        // updating average rating
        const reviews = await Review.find({ reviewee });

        const avgRating = reviews.reduce((sum, review) =>
            sum + review.rating,
            0
        ) / reviews.length;

        await User.findByIdAndUpdate(
            reviewee,
            {
                rating: avgRating,
                totalReviews:reviews.length
            }
        );

        res.status(201).json({
            message:"Review added",
            review
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserReviews = async(req,res) => {
    try{
        const reviews = await Review.find({
            reviewee: req.params.id
        })
        .populate(
            "reviewer",
            "name email"
        );

        res.status(200).json({
            count: reviews.length,
            reviews
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createReview,
    getUserReviews
};