const express = require("express");

const router = express.Router();
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");
const { registerUser,loginUser, forgetPassword, resetPassword} = require("../controllers/authController");

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;