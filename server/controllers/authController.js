const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


const registerUser = async (req,res)=>{
    try{
        const{name, email, password} = req.body;

        // check require fields
       if(!name || !email || !password){
        return res.status(400).json({
            message : "All fields are required"
        }); 
       }


       //check existing user
       const existingUser = await User.findOne({email});

       if(existingUser){
        return res.status(400).json({
            message: "User already exists"
        });
       }
    

    //Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
        password,
        salt
    );

    // create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({

         message: "User Registered succesfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });
      
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


const loginUser = async (req,res)=>{
    try{
        const {email, password} = req.body;
   
        // check fields
        if(!email || !password){
            return res.status(400).json({
                message: "Email and password required"
            });
        }
        // find user
         const user = await User.findOne({ email });
        
        if(!user){
            return res.status(400).json({
                message: "Invaild credentials"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message: "Invaild credentials"
            });
        }

        // Genrate token
        const token = jwt.sign(
            {
                userId: user._id
            },
               process.env.JWT_SECRET,
            {
               expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login succesful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
    
};
module.exports = {registerUser, loginUser};
