const Connection = require("../models/Connecton");
const User = require("../models/User")

// Send request

const sendRequest = async (req,res) => {
    try{
        const reciverId = req.params.userId;

        if(reciverId===req.user._id.toString()){
            return res.status(400).json({
                message: "Cannot send request to yourself"
            });
        }

        const existingRequest = await Connection.findOne({
            sender: req.user._id,
            reciver: reciverId
        });

        if(existingRequest){
            return res.status(400).json({
                message: "Request alredy send"
            });
        }

        const request = await Connection.create({
            sender: req.user._id,
            reciver: reciverId
        });

        res.status(201).json({
            message: "Requst sent",
            request
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

// get requests

const getRequests = async (req,res) => {
    try{
        const requests = await Connection.find({
            reciver: req.user._id,
            status: "pending"
        }).populate(
            "sender",
            "name email skillsOfferd skillsWanted"
        );
        res.status(200).json({
            count: req.length,
            requests
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

// accept request

const acceptRequest = async (req,res) => {
    try{
        const request = await Connection.findById(req.params.id);

        if(!request){
            return res.status(404).json({
                message: "Request not found"
            });
        }
        request.status = "accapted"

        await request.save();

        res.status(200).json({
            message: "Request accepted"
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

// reject request

const rejectRequest = async (req,res) => {
    try{
        const request = await Connection.findById(req.params.id);

        if(!request){
            return res.status(404).json({
                message: "Request not found"
            });
        }
        request.status = "rejected";
        await request.save();
        
        res.status(200).json({
            message: "Request rejected"
        });

    } catch(error){
        res.status(500).json({
            messege: error.message
        });
    }
};

module.exports = {
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest
};