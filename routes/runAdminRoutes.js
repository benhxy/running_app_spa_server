var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("../config");
var run_admin_controller = require("../controllers/runAdminController");

/* token struction:
 - id: user id
 - role: user role
 */

//auth middleware
router.use( function(req, res, next) {

  var token = req.headers.token;

  if (!token) {
    console.log("No token");
    return res.json( {success: false, message: "No token provided"} );
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err || decoded.role !== "admin") {
      console.log("Token not valid");
      return res.json( {success: false, message: "Token not valid or no permission"});
    }
    req.decoded = decoded;
  });
  console.log("Admin passed validation");
  next();
});

//view all
router.get("/", run_admin_controller.view);
//view all
router.get("/:id", run_admin_controller.view_one);
//create one
router.post("/", run_admin_controller.create);
//update one
router.put("/:id", run_admin_controller.update);
//delete one
router.delete("/:id", run_admin_controller.delete);


module.exports = router;
