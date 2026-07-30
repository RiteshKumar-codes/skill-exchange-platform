const connectedUsers = new Map();

const initializeSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", (userId) => {
            connectedUsers.set(userId,socket.id);
            console.log(`User ${userId} registered`);
        });

        socket.on("disconnect", () => {
            for(const [userId, socketId] of connectedUsers) {

                if(socketId === socket.id){

                    connectedUsers.delete(userId);
                    break;
                }
            }

            console.log("User disconnected");
        });
    });
};

module.exports = { initializeSocket, connectedUsers};