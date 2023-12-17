const course = require("../models/course_model");
const { validationResult } = require("express-validator");
const asynchandler = require("express-async-handler");

exports.GetAllcourses = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  try {
    const courses = await course
      .find({}, { __v: false })
      .limit(limit)
      .skip(skip);
    res
      .status(200)
      .json({ status: "succsess", length: courses.length, data: { courses } });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.Getcourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const foundCourse = await course.findById(courseId);
    if (!foundCourse) {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.json({ status: "success", data: foundCourse });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.CreateCourse = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newCourse = await course.create(req.body);
    res
      .status(201)
      .json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const updatedCourse = await course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    if (!updatedCourse) {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(201).json({ msg: "Update successful", course: updatedCourse });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    await course.findByIdAndDelete(courseId);
    res.status(201).json({ msg: `Course ${courseId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
