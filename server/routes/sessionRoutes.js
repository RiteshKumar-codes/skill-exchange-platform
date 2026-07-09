const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createSession,
    getSessions,
    completeSession
} = require("../controllers/sessionController");

router.post("/create",protect,createSession);
router.get("/",protect,getSessions);
router.put("/complete/:id",protect,completeSession);

module.exports = router;