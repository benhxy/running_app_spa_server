//import models
var Run = require("../models/run");
var User = require("../models/user");


//view all or create one - WORKING
exports.view = function (req, res) {
  Run.find(function(err, results) {
    if (err) {
      return res.json({success: false, message: "Fail to query"});
    } else {
      return res.json({success: true, message: results});
    }
  });
}


//get one run item - WORKING
exports.view_one = function(req, res) {
  Run.findById(req.params.id, function(err, result) {
    if (err) {
      return res.json({success: false, message: "Record not found", error: err});
    } else {
      return res.json({success: true, message: result});
    }
  });
};


exports.create = function(req, res) {
  var new_run = new Run();

  if (req.body.dist) {
    new_run.dist = req.body.dist;
  } else {
    return res.json({success: false, message: "Distance cannot be empty"});
  }

  if (req.body.time) {
    new_run.time = req.body.time;
  } else {
    return res.json({success: false, message: "Time cannot be empty"});
  }

  new_run.user = req.body.id;

  if (req.body.date) {
    new_run.date = req.body.date;
  }

  new_run.save(function(err, result) {
    if (err || !result){
      return res.json({success: false, message: "Fail to save the record"  + JSON.stringify(err)});
    } else {
      return res.json({success: true, message: result});
    }
  });
};

//update run - WORKING
exports.update = function(req, res) {
  var updatedRun = {};
  if (req.body.dist) {
    updatedRun.dist = req.body.dist;
  }
  if (req.body.time) {
    updatedRun.time = req.body.time;
  }
  if (req.body.date) {
    updatedRun.date = new Date(req.body.date);
  }

  Run.findByIdAndUpdate(req.params.id, updatedRun, function(err, result) {
    if (err || !result){
      return res.json({success: false, message: "Fail to update the record"});
    } else {
      return res.json({success: true, message: result});
    }
  });
};

//delete run - WORKING
exports.delete = function(req, res) {
  Run.findByIdAndRemove(req.params.id, function(err, run) {
    if (err || !run){
      return res.json({success: false, message: "Fail to delete record", error: err});
    } else {
      return res.json({success: true, messgae: "Record deleted"});
    }
  });
};
