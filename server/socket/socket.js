const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectedUsers = new Map();
const Chat = require("../models/Chat");

const initializeSocket = (io) => {

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Authentication required")
                )
            }
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(
                decoded.userId
            ).select("-password");

            if (!user) {
                return next(
                    new Error("User no longer exists")
                )
            }
            socket.user = user;
            next();
        } catch (error) {
            next(
                new Error("Invaild or expire token")
            )
        }
    })

    io.on("connection", (socket) => {

        const userId = socket.user._id.toString();
        connectedUsers.set(userId, socket.id);
        console.log(`User connected: ${userId}`);



        socket.on("disconnect", () => {
            for (const [userId, socketId] of connectedUsers) {

                if (socketId === socket.id) {

                    connectedUsers.delete(userId);
                    break;
                }
            }

            console.log("User disconnected");
        });

        socket.on("sendMessage", async (data) => {

            try {
                const { receiver, message } = data;
                const sender = socket.user._id;

                if (!receiver || !message) {
                    return socket.emit("errorMessage", {
                        message: "Receiver and message are required"
                    });
                }

                if (receiver.toString() === sender.toString()) {
                    return socket.emit("errorMessage", {
                        message: "You can not send a message to yourself"
                    });
                }

                const receiverUser =
                    await User.findById(receiver);

                if (!receiverUser) {
                    return socket.emit("errorMessage", {
                        message: "Receiver not found"
                    });
                }

                const chat = await Chat.create({
                    sender,
                    receiver,
                    message,
                    status: "sent"
                });

                const receiverSocket = connectedUsers.get(receiver.toString());

                if (receiverSocket) {

                    chat.status = "delivered";
                    await chat.save();

                    io.to(receiverSocket).emit("receiveMessage", {
                        _id: chat._id,
                        sender: chat.sender,
                        receiver: chat.receiver,
                        message: chat.message,
                        status: chat.status,
                        createdAt: chat.createdAt
                    });
                }
            } catch (error) {
                console.error(
                    "Socket message error:",
                    error);

                socket.emit("errorMessage", {
                    message: "Faild to send message"
                });
            }
        });

        socket.on("checkOnline", (userId) => {
            const isOnline = connectedUsers.has(userId.toString());

            socket.emit("userOnlineStatus", {
                userId,
                online: isOnline
            });
        });

        socket.on("typing", (data) => {
            const {
                receiver
            } = data;

            const sender = socket.user._id.toString();

            const receiverSocket = connectedUsers.get(receiver.toString());

            if (receiverSocket) {
                io.to(receiverSocket).emit(
                    "userTyping",
                    {
                        sender
                    }
                );
            }
        });

        socket.on("stopTyping", (data) => {

            const {
                receiver
            } = data;

             const sender = socket.user._id.toString();

            const receiverSocket =
                connectedUsers.get(
                    receiver.toString()
                );

            if (receiverSocket) {

                io.to(receiverSocket).emit(
                    "userStoppedTyping",
                    {
                        sender
                    }
                );

            }

        });

        socket.on("messageSeen", async (data) => {
            try {
                const {
                    messageId,
                } = data;

                const message = await Chat.findById(
                    messageId
                );

                if (!message) {
                    return;
                }

                // only receiver can make the message seen
                if (message.receiver.toString() !== socket.user._id.toString()) {
                    return socket.emit("errorMessage", {
                        message: "You can not update this message"
                    });
                }

                message.status = "seen";

                await message.save();

                const senderSocket = connectedUsers.get(
                    message.sender.toString()
                );

                if (senderSocket) {
                    io.to(senderSocket).emit("messageSeen",
                        {
                            messageId
                        }
                    );
                }
            } catch (error) {
                console.error(
                    "Seen status error:",
                    error
                );
            }
        });
    });
};

module.exports = { initializeSocket, connectedUsers };