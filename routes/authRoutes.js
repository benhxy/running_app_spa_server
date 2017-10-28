var express = require("express");
var router = express.Router();
var auth_controller = require("../controllers/authController");

//receive user name and password and return jwt
router.post("/login/", auth_controller.get_token);

router.post("/signup/", auth_controller.signup);

module.exports = router;
