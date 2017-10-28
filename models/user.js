var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  role: { type: String, required: true, enum: ["user", "userManager", "admin"] },
  date_of_register: { type: Date, default: Date.now},
});

module.exports = mongoose.model("User", UserSchema, "user");
