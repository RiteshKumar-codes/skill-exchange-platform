const Connection = require("../models/Connection");
const User = require("../models/User")
const Notification = require("../models/Notification");
const {connectedUsers} = require("../socket/socket");

// Send request

const sendRequest = async (req, res) => {
    try {
        const receiverId = req.params.userId;

        if (receiverId === req.user._id.toString()) {
            return res.status(400).json({
                message: "Cannot send request to yourself"
            });
        }

        const existingRequest = await Connection.findOne({
            sender: req.user._id,
            receiver: receiverId
        });



        if (existingRequest) {
            return res.status(400).json({
                message: "Request already send"
            });
        }


        const request = await Connection.create({
            sender: req.user._id,
            receiver: receiverId
        });

        await Notification.create({
            recipient: receiverId,
            message: `${req.user.name} sent you a connection request`,
            type: "connection"
        });

        const io = req.app.get("io");

        const receiverSocketId = connectedUsers.get(receiverId);

        if(receiverSocketId){

            io.to(receiverSocketId).emit(
                "newNotification",
                {
                    message: `${req.user.name} sent you a connection request`,
                    type: "connection"
                }
            );
        }

        res.status(201).json({
            message: "Requst sent",
            request
        });
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

// get requests

const getRequests = async (req, res) => {
    try {
        const requests = await Connection.find({
            receiver: req.user._id,
            status: "pending"
        }).populate(
            "sender",
            "name email skillsOffered skillsWanted"
        );
        res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// accept request

const acceptRequest = async (req, res) => {
    try {
        const request = await Connection.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }
        request.status = "accepted"

        await request.save();

        await Notification.create({
            recipient: request.sender,
            message: "Your connection request was accepted",
            type: "connection"
        });

        res.status(200).json({
            message: "Request accepted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// reject request

const rejectRequest = async (req, res) => {
    try {
        const request = await Connection.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }
        request.status = "rejected";
        await request.save();

        res.status(200).json({
            message: "Request rejected"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest
};