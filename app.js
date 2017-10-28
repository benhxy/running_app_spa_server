//express
var express = require('express');
var app = express();
var config = require("./config");

//mongoose and mongodb
var mongoose = require("mongoose");
var mongoDB = config.databaseUrl;
mongoose.connect(mongoDB, {useMongoClient: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


//allow cross-domain
app.use(function(req, res, next) {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  });
  next();
});

//middleware
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

console.log("Final version");

//routes
/*
var User = require("./models/user");
app.get("/api/test", function (req, res) {

  User.findOneAndUpdate({name: "admin"}, {role: "admin"});
  res.send("test");

});
*/

var authRoutes = require("./routes/authRoutes");
var userRoutes = require('./routes/userRoutes');
var runRoutes = require("./routes/runRoutes");
var runAdminRoutes = require("./routes/runAdminRoutes");
app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/run", runRoutes);
app.use("/api/run_admin", runAdminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({message: "An error occurred", error: err});
});

module.exports = app;
