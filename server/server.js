const  express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorMiddleWare");


const dotenv = require("dotenv");
dotenv.config();
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,

    message: {
        message: "To many request, Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 10,

    message: {
        message:
            "Too many login attempts. Try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});

const connectDB = require("./config/db");

connectDB();

const app = express();



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})
);
app.use(express.json({
    limit: "10kb"
})
);
app.use(helmet());
app.use(limiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/connections",connectionRoutes);
app.use("/api/sessions",sessionRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/chat", chatRoutes);
app.use(errorHandler)

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