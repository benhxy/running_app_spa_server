var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("../config");
var user_controller = require("../controllers/userController");

//auth middleware

router.use( function(req, res, next) {
  //get token
  var token = req.headers.token;
  //no token error
  if (!token) {
    res.json( {success: false, message: "No token provided"});
  }
  //token verification error
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      res.json( {success: false, message: "Fail to verify token"});
    } else {
      req.decoded = decoded;
    }
  });
  //permission error
  if (req.decoded.role !== "userManager" && req.decoded.role !== "admin") {
    res.json( {success: false, message: "No permission to access user database"});
  }
  //all clear
  next();
});


//get all users
router.get('/', user_controller.view);
//get one user detail
router.get('/:id', user_controller.view_one);
//create user
router.post("/", user_controller.create);
//update user
router.put("/:id", user_controller.update);
//delete user
router.delete("/:id", user_controller.delete);

module.exports = router;
