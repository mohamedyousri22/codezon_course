const express = require("express");

const router = express.Router();
const coursesControllers = require("../controllers/courses-controllesrs");
const validationschema = require("../middlewars/validationschema");
router
  .route("/")
  .get(coursesControllers.GetAllcourses)
  .post(validationschema, coursesControllers.CreateCourse);

router
  .route("/:courseId")
  .get(coursesControllers.Getcourse)
  .patch(coursesControllers.updateCourse)
  .delete(coursesControllers.deleteCourse);
module.exports = router;
