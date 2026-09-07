const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");
const {
    welcomeEmail,
    passwordResetEmail
} = require("../services/emailTemplates");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check require fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        //check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
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

        sendEmail({
            to: user.email,
            subject: "Welcome to Skill Exchange Platform",
            html: welcomeEmail(user.name)
        }).catch((error) => {
            console.error(
                "Welcome email failed:",
                error.message
            );
        });

        res.status(201).json({

            message: "User Registered succesfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }
        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invaild credentials"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
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
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        // not reveal whether an account exists

        if (!user) {
            return res.status(200).json({
                message: "If an account exists with this email, a password reset link has been sent"
            });
        }

        // Genrate random token

        const resetToken = crypto.randomBytes(32).toString("hex");

        // hash token before storing it
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // token vaild for 15 minutes
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password-Reset - Skill Exchange Platform",
            html: passwordResetEmail(
                user.name,
                resetUrl
            )
        });

        res.status(200).json({
            message: "If an account exists with this email, a password reset link has been sent."
        });
    } catch (error) {
        console.error("Forget passwod error: ", error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

const resetPassword = async(req, res) => {
    try{
        const {token} = req.params;
        const{password} = req.body;

        if(!password){
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if(password.length<8){
            return res.status(400).json({
                 message: "Password must be at least 8 characters"
            });
          
        }

        // Hash token receive from user
        const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if(!user){
            return res.status(400).json({
                message: "Invaild or expired password token"
            });
        }

        // Hashed new password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        user.password = hashedPassword;

        // Invalidate reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch(error){
        console.error("Reset password error: ", error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }
};

module.exports = { registerUser, loginUser, forgetPassword, resetPassword };

