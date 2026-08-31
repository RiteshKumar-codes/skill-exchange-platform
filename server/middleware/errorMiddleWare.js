const errorHandler = (
    error,
    req,
    res,
    next
) => {
    console.error(error);
    const statusCode = res.statusCode != 200 ? res.statusCode: 500;

    res.status(statusCode).json({
        message: error.message || "Internal server error"
    });
};

module.exports = errorHandler;