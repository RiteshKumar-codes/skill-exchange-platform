const  express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const connectDB = require("./config/db");

dotenv.config();
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

app.get("/",(req,res)=>{
   res.send("Skill Exchange Platform API Running");
});

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
