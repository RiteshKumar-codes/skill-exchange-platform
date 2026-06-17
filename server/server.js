const  express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.get("/",(req,res)=>{
   res.send("Skill Exchange Platform API Running");
});

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
