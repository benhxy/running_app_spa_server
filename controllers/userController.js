//import models
var User = require("../models/user");

//list all users - WORKING
exports.view = function(req, res) {
  User.find(function(err, results) {
    if (err) {
      return res.json({success: false, message: "Fail to query", error: err});
    } else {
      //console.log(JSON.stringify(results));
      return res.json({success: true, message: results});
    }
  });
};

//get one user - WORKING
exports.view_one = function(req, res) {

  User.findById(req.params.id, function(err, result) {
    if (err) {
      return res.json({success: false, message: "User not found"});
    } else {
      return res.json({success: true, message: result});
    }
  });
};

//create user - WORKING
exports.create = function(req, res) {

  if (!req.body.name || !req.body.password || !req.body.role) {
    return res.json({success: false, message: "Please enter name, password and role"});
  }

  //check duplicate user name
  var new_user_name = req.body.name;
  User.find({name: new_user_name}, function(err, result) {
    if (result.length > 0) {
      return res.json({success: false, message: "User name already exists"});
    } else {
      var new_user = new User();
      new_user.name = req.body.name;
      new_user.password = req.body.password;
      new_user.role = req.body.role;

      new_user.save(function(err, user) {
        if (err) {
          return res.json({
            success: false,
            message: "Fail to save user to database" + JSON.stringify(err)
          });
        } else {
          return res.json({success: true, message: user});
        }
      });
    }
  });
};

//update user - WORKING
exports.update = function(req, res) {
  User.findByIdAndUpdate(req.params.id, {
      password: req.body.password,
      role: req.body.role
    },
    function(err, result0) {
      if (err) {
        return res.json({success: false, message: "Fail to update user"});
      } else {
        return res.json({success: true, message: result0});
      }
    }
  );
};

//remove user - WORKING

exports.delete = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (!err) {
      return res.json({success: true, message: "User deleted!"});

    } else {
      return res.json({success: false, message: "Fail to remove user"});
    }
  });
};
