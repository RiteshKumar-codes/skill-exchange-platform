const express = require("express");

const router = express.Router();
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");
const { registerUser,loginUser} = require("../controllers/authController");

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginUser);

module.exports = router;