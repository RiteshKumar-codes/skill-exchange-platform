const Chat = require("../models/Chat");
const Connection = require("../models/Connection");

// API 1 send message

const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.userId;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const connection = await Connection.findOne({
            $or: [
                {
                    sender: req.user._id,
                    receiver: receiverId
                    
                },
                {
                    sender: receiverId,
                    receiver: req.user._id
                   
                }
            ],
            status: "accepted"
        });

        if(!connection){
            return res.status(403).json({
                message: "You can only chat with connected users"
            });
        }

        const chat = await Chat.create({
            sender: req.user._id,
            receiver: receiverId,
            message
        });

        res.status(201).json(chat);
    } catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};

// API 2 get chat history

const getMessages = async (req,res) => {
    try{
        const otherUser = req.params.userId;

        const messages = await Chat.find({
           $or: [
            {
                sender: req.user._id,
                receiver: otherUser

            },
            {
                sender: otherUser,
                receiver: req.user._id
            }
           ]
        }).sort({
            createdAt: 1
        });

        res.status(200).json({
            count: messages.length,
            messages
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { sendMessage, getMessages};