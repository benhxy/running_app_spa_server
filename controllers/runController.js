//import models
var Run = require("../models/run");
var User = require("../models/user");
var ObjectId = require("mongoose").Types.ObjectId;


//get run by user - WORKING
exports.view = function(req, res) {
  Run.find({user: new ObjectId(req.decoded.user)}, function(err, results) {
    if (err) {
      return res.json({success: false, message: "Fail to query", error: err});
    } else {
      return res.json({success: true, message: results});
    }
  });
};

//get one run item - NEED ACCESS CONTROL
exports.view_one = function(req, res) {
  Run.findById(req.params.id, function(err, result) {
    if (err) {
      return res.json({success: false, message: "Record not found", error: err});
    } else {
      if (result.user == req.decoded.user) {
        return res.json({success: true, message: result});
      } else {
        return res.json({success: false, message: "No permission to access other users' records"});
      }
    }
  });
};

//create run - WORKING
exports.create = function(req, res) {

  var new_run = new Run();
  new_run.user = req.decoded.user;
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
  if (req.body.date) {
    new_run.date = req.body.date;
  }

  new_run.save(function(err, result) {
    if (err){
      return res.json({success: false, message: "Fail to save the record", error: err});
    } else {
      return res.json({success: true, message: result});
    }
  });
};

//update run - WORKING
exports.update = function(req, res) {

  Run.findById(req.params.id, function(err, run) {
    if (err || !run){
      return res.json({success: false, message: "Record not found", error: err});
    }

    if (run.user == req.decoded.user) {
      if (req.body.dist) {
        run.dist = req.body.dist;
      }
      if (req.body.time) {
        run.time = req.body.time;
      }
      if (req.body.date) {
        run.date = req.body.date;
      }

      run.save(function(err, result) {
        if (err){
          return res.json({success: false, message: "Fail to update the record", error: err});
        } else {
          return res.json({success: true, message: result});
        }
      });
    } else {
      return res.json({success: false, message: "No permission to access other users' records"});
    }
  });
};

//delete run - WORKING
exports.delete = function(req, res) {

  Run.findById(req.params.id, function(err, run) {
    if (err || !run){
      return res.json({success: false, message: "Record not found", error: err});
    }

    if (run.user != req.decoded.user) {
      return res.json({success: false, message: "No permission to access other users' records"});
    }
  });

  Run.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return res.json({success: false, message: "Fail to delete record"});
    } else {
      return res.json({success: true, messgae: "Record deleted"});
    }
  });

};

//get weekly report by user - WORKING
exports.report = function(req, res) {

  // Returns the ISO week of the date.
  Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
     date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  // Returns the four-digit year corresponding to the ISO week of the date.
  Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
  }

  //get all run records by user_id
  Run.find({user: new ObjectId(req.decoded.user)}, function (err, runs) { //
    if (err) {
      return res.json({success: false, message: "Fail to query record or no record", error: err});
    } else {

      let dist_map = new Map();
      let time_map = new Map();
      let count_map = new Map();

      for (let i = 0; i < runs.length; i++) {

        console.log();

        let run_time = runs[i].time;
        let run_dist = runs[i].dist;
        let run_week = runs[i].date.getWeekYear() + " - Week " + runs[i].date.getWeek();

        if (dist_map.has(run_week)) {
          dist_map.set(run_week, dist_map.get(run_week) + run_dist);
          time_map.set(run_week, time_map.get(run_week) + run_time);
          count_map.set(run_week, count_map.get(run_week) + 1);
        } else {
          dist_map.set(run_week, run_dist);
          time_map.set(run_week, run_time);
          count_map.set(run_week, 1);
        }
      }

      let weeklyAvg = [];
      for (let [key, value] of dist_map) {
        let week = key;
        let count = count_map.get(key);
        let dist = value / count;
        let time = time_map.get(key) / count;
        let speed = dist /time * 60;
        weeklyAvg.push({
          week: week,
          dist: dist,
          time: time,
          speed: speed
        });
      }

      return res.json({success: true, message: weeklyAvg});
    }
  });
};
