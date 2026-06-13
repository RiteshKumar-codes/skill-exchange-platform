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
            message: "User already exist"
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

    res.status(400).json({

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

module.exports = {registerUser};
