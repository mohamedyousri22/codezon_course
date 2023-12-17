const express = require("express");
const multer = require("multer");
const router = express.Router();
const usersControllers = require("../controllers/users_controllers");
const verifyToken = require("../middlewars/verifyToken");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.route("/").get(verifyToken, usersControllers.getallusers);

router
  .route("/register")
  .post(upload.single("avatar"), usersControllers.register);

router.route("/login").post(usersControllers.login);

module.exports = router;
