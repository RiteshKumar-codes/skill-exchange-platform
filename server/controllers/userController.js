const getProfile = async (req,res) => {
    res.status(200).json({
        User: req.User
    });
}

module.exports = { getProfile };