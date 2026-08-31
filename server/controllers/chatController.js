const Chat = require("../models/Chat");
const Connection = require("../models/Connection");

// API 1 send message

const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.userId;
        const { message } = req.body;

        if (!message || !message.trim()) {
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

        if (!connection) {
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
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// API 2 get chat history

const getMessages = async (req, res) => {
    try {
        const otherUser = req.params.userId;

        const page = req.query.page
            ? Number(req.query.page)
            : 1;

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 20;


        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                message: "Invaild pagination values"
            });
        }

        const skip = (page - 1) * limit;

        const query = {
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
        };

        const totalMessages = await Chat.countDocuments(query);

        const messages = await Chat.find(query)
            .populate(
                "sender",
                "name profileImage"
            )
            .populate(
                "receiver",
                "name profileImage"
            )
            .sort({
                createdAt: 1
            })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            currentPage: page,

            totalPages:
                Math.ceil(
                    totalMessages / limit
                ),

            totalMessages,

            messages

        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { sendMessage, getMessages };