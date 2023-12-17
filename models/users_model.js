const mongoose = require("mongoose");
var validator = require("validator");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "field must be a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "too short password"],
    maxlength: 100,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "MANGER"],
    default: "USER",
  },
  avatar: {
    type: String,
    default: "../uploads/profile.jpg",
  },
});

module.exports = mongoose.model("User", UserSchema);
