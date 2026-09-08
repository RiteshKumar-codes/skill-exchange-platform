const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "Not authorize"
            });
        }
        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findById(decode.userId).select("-password");

         if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
}

module.exports = protect;