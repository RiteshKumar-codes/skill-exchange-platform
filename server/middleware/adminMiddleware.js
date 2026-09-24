const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Not authorized. User not found."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
};

module.exports = adminMiddleware;