const  express = require("express");

const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const {Server} = require("socket.io");
const {initializeSocket} = require("./socket/socket");

const connectDB = require("./config/db");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/connections",connectionRoutes);
app.use("/api/sessions",sessionRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/",(req,res)=>{
   res.send("Skill Exchange Platform API Running");
});

const PORT = 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

initializeSocket(io);

app.set("io",io);

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});