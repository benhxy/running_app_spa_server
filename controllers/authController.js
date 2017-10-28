var jwt = require("jsonwebtoken");
var config = require("../config");
var User = require("../models/user");

exports.get_token = function(req, res) {
  User.findOne({name: req.body.name}, function(err, user) {
    if (err || !user) {
      return res.json({success: false, message: "User not found"});
    }
    if (!req.body.password) {
      return res.json({success: false, message: "Password cannot be empty"});
    }
    if (user.password != req.body.password) {
      return res.json({success: false, message: "Wrong password"});
    }

    //contruct token, which include user id, role,TTL
    const payload = {
      user: user._id, //to query runs by user
      role: user.role //to check permission
    };
    var token = jwt.sign(payload, config.secret, {expiresIn: config.ttl});

    //return user role so frontend can selectively display admin links
    return res.json({
      success: true,
      message: "Authentication successful",
      user: user._id,
      name: user.name,
      role: user.role,
      token: token
    });

  });
};


exports.signup = function (req, res) {
  //check duplicate user name
  var new_user_name = req.body.name;
  User.find({name: new_user_name}, function(err, result) {
    if (result.length === 0) {
      //create new user
      var new_user = new User({
        name: req.body.name,
        password: req.body.password,
        role: "user"
      });
      new_user.save(function(err, user) {
        if (err) {
          return res.json({success: false, message: "Fail to create user"});
        } else {
          //contruct token, which include user id, role,TTL
          const payload = {
            user: user._id, //to query runs by user
            role: user.role //to check permission
          };
          var token = jwt.sign(payload, config.secret, {expiresIn: config.ttl});

          //return user role so frontend can selectively display admin links
          return res.json({
            success: true,
            message: "Registration successful",
            user: user._id,
            name: user.name,
            role: user.role,
            token: token
          });
        }
      });
    } else {
      return res.json({success: false, message: "User name already exists"});
    }
  });
};
