var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("../config");
var run_controller = require("../controllers/runController");

/* token struction:
 - id: user id
 - role: user role
 */

//auth middleware
router.use( function(req, res, next) {

  var token = req.headers.token || req.headers['x-access-token'];
  if (!token) {
    res.json( {success: false, message: "No token provided"});
  }
  //token verification error
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      res.json( {success: false, message: "Fail to verify token"});
    }
    req.decoded = decoded;
  });

  //all clear
  next();
});

/* normal user routes */

//get run
router.get("/", run_controller.view);
//get weekly report by user
router.get("/report/", run_controller.report);
//get one run
router.get("/:id", run_controller.view_one);
//create run
router.post("/", run_controller.create);
//update run
router.put("/:id", run_controller.update);
//delete run
router.delete("/:id", run_controller.delete);



module.exports = router;
