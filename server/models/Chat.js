const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        
       status: {
        type: String,
        enum: [
            "sent",
            "delivered",
            "seen"
        ],
        default: "sent"
       }
    },
    {
        timestamps: true
    }
);

chatSchema.index({
    sender: 1,
    receiver: 1,
    createdAt: -1
});

chatSchema.index({
    receiver: 1,
    sender: 1,
    createdAt: -1
});

module.exports = mongoose.model("Chat", chatSchema);