const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest
} = require("../controllers/connectionController");

router.post("/send/:userId",protect,sendRequest);

router.get("/",protect,getRequests);
router.put("/accept/:id",protect,acceptRequest);
router.put("/reject/:id",protect,rejectRequest);

module.exports = router;