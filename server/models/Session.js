const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        mentor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        learner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        skill: {
            type: String,
            required: true
        },
        sessionDate:{
            type:Date,
            required: true
        },
        status: {
            type: String,
            enum:[
                "scheduled",
                "completed",
                "cancelled"
            ],
            default:"scheduled"
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Session",sessionSchema);