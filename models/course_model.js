const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: String,
  price: Number,
});

const courseSchema = mongoose.model("Course", userSchema);
module.exports = courseSchema;
