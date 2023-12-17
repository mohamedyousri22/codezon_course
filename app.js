const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
// upload photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

const CourseRoute = require("./routes/courses.routes");
const UserRoute = require("./routes/user.routes");

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database connected successfully...");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Routes
app.use("/api/courses", CourseRoute);
app.use("/api/users", UserRoute);

// 404 Handler
app.all("*", (req, res, next) => {
  res.status(404).json({ status: "error", msg: "Resource not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ error: err.message });
});
