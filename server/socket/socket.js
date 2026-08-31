const connectedUsers = new Map();
const Chat = require("../models/Chat");

const initializeSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", (userId) => {
            connectedUsers.set(userId.toString(), socket.id);
            console.log(`User ${userId} registered`);
        });

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

            try{
            const { sender, receiver, message } = data;
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
                error.message);
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
            sender,
            receiver
        } = data;

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
            sender,
            receiver
        } = data;

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
        try{
            const {
                messageId,
                sender,
            } = data;

            const message = await Chat.findById(
                messageId
            );

            if(!message){
                return;
            }

            message.status = "seen";

            await message.save();

            const senderSocket = connectedUsers.get(sender.toString());

            if(senderSocket){
                io.to(senderSocket).emit("messageSeen",
                    {
                        messageId
                    }
                );
            }
        } catch(error){
            console.error(
                "Seen status error:",
                error.message
            );
        }
    });
});
};

module.exports = { initializeSocket, connectedUsers };