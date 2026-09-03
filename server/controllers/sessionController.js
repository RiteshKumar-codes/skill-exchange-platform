const Session = require("../models/Session");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { connectedUsers } = require("../socket/socket");
const { sendEmail } = require("../services/emailService");
const {
    sessionScheduledEmail
} = require("../services/emailTemplates");

const createSession = async (req, res) => {
    try {
        const {
            mentor,
            learner,
            skill,
            sessionDate
        } = req.body;

        const session = await Session.create({
            mentor,
            learner,
            skill,
            sessionDate
        });

        await Notification.create({
            recipient: learner,
            message: `New ${skill} session scheduled`,
            type: "session"
        });

        const io = req.app.get("io");

        const socketId = connectedUsers.get(learner.toString());

        if (socketId) {

            io.to(socketId).emit(
                "newNotification",
                {
                    message: `session scheduled`,
                    type: "session"
                }
            );
        }

        // Find learner and mentor
        const learnerUser = await User.findById(session.learner);
        const mentorUser = await User.findById(session.mentor);

        sendEmail({
    to: learnerUser.email,

    subject: "Learning Session Scheduled",

    html: sessionScheduledEmail(
        session.skill,
        mentorUser.name,
        session.sessionDate,
        session.status || "scheduled"
    )
}).catch((error) => {
    console.error(
        "Session email failed:",
        error.message
    );
});

        res.status(201).json({
            message: "Session created"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [
                { mentor: req.user._id },
                { learner: req.user._id }
            ]
        })
            .populate("mentor", "name email")
            .populate("learner", "name email");

        res.status(200).json({
            count: sessions.length,
            sessions
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const completeSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
          return res.status(404).json({
                message: "Session not find"
            });
        }
         session.status = "completed";

        await session.save();

        res.status(200).json({
            message: "Session completed"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createSession,
    getSessions,
    completeSession
};