const Notification = require("../models/Notification");

const getNotifications = async(req,res) => {
    try{
        const notifications = await Notification.find({
            recipient: req.user._id
        }).sort({ createdAt: -1});

        res.status(200).json({
            count: notifications.length,
            notifications
        });
    } catch(error){

        res.status(500).json({
            message: error.message
        });
    }
};

const markAsRead = async(req,res) => {
    try{
        const notification = await Notification.findById(req.params.id);

        if(!notification){
           return res.status(404).json({
            message: "Notification not found"
           });
        }

        notification.isRead = true;

        res.status(200).json({
            message: "Notification marked as read"
        });
    } catch(error){ 
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {getNotifications, markAsRead};