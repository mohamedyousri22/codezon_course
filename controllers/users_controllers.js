const User = require("../models/users_model");
const apperror = require("../utils/app.error");
const httpstatus = require("../utils/httpstatus");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getallusers = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find({}, { __v: false, password: false })
      .limit(limit)
      .skip(skip);
    res
      .status(200)
      .json({ status: "success", length: users.length, data: { users } });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  const olduser = await User.findOne({ email: email });

  if (olduser) {
    return res.status(400).json({
      status: httpstatus.FAIL,
      message: "Email already exists",
    });
  }

  try {
    // Hash password
    const hashedpassword = await bcrypt.hash(password, 10);

    // Create a new User instance
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedpassword,
    });

    // Check if a file was uploaded
    if (req.file) {
      // Include the filename in the User object
      newUser.avatarFilename = req.file.filename;
    }

    // JWT creation
    const token = await jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.jwt_secrete_Key
    );
    newUser.token = token;

    // Save the user to the database
    const savedUser = await newUser.save();

    // Response with user data including the filename
    res.status(201).json({
      message: "User added successfully",
      User: {
        id: savedUser._id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        avatarFilename: savedUser.avatarFilename, // Include filename here
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation errors
      res
        .status(400)
        .json({ status: httpstatus.ERROR, message: error.message });
    } else {
      // Handle other types of errors
      res
        .status(500)
        .json({ status: httpstatus.ERROR, message: "Internal Server Error" });
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: httpstatus.FAIL,
      message: "Email and password are required",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ status: httpstatus.FAIL, message: "User not found" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (matchedPassword) {
      // You can generate and send a JWT token here if needed
      // Example: const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const token = await jwt.sign(
        { email: user.email, id: user._id },
        process.env.jwt_secrete_Key,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        status: httpstatus.SUCCESS,
        message: "Logged in successfully",
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          token: token,
        },
        // Include token if needed
        // token: token,
      });
    } else {
      return res
        .status(400)
        .json({ status: httpstatus.ERROR, message: "Invalid credentials" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: httpstatus.ERROR, message: "Internal Server Error" });
  }
};
