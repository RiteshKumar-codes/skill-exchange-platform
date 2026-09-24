
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const { sendEmail } = require("../services/emailService");

const {
    welcomeEmail,
    passwordResetEmail
} = require("../services/emailTemplates");


// ==============================
// REGISTER USER
// ==============================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Send welcome email
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
            message: "User Registered successfully",

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


// ==============================
// LOGIN USER
// ==============================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate token
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
            message: "Login successful",
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


// ==============================
// FORGOT PASSWORD
// ==============================

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        // Do not reveal whether account exists
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent"
            });
        }

        // Generate random token
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        // Hash token before storing it
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token valid for 15 minutes
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        // Create reset URL
        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send reset email
        await sendEmail({
            to: user.email,
            subject: "Password Reset - Skill Exchange Platform",
            html: passwordResetEmail(
                user.name,
                resetUrl
            )
        });

        res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};


// ==============================
// RESET PASSWORD
// ==============================

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters"
            });
        }

        // Hash token received from user
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid or expired password token"
            });
        }

        // Hash new password
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

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};


// ==============================
// EXPORT CONTROLLERS
// ==============================

module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword
};

