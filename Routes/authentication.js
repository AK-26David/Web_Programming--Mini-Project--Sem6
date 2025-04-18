const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../Middleware/fetchuser");
require("dotenv").config();

// Creating an user
router.post(
  "/create-user",
  // Validation for incoming request
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // Finding the unique User to remove duplicacy
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }
      // if user is not already registered then create a new user
      let salt = await bcrypt.genSaltSync(10);
      let secured = await bcrypt.hashSync(req.body.password, salt);
      let userData = await User.create({
        name: req.body.name,
        password: secured,
        email: req.body.email,
        isVerified: true,
      });
      const data = {
        user: {
          id: userData.id,
        },
      };
      const authtoken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      return res.json({ success, authtoken });
    } catch (error) {
      success = false;
      console.log(error);
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password string cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Please try to login with correct credentials",
        });
      }
      //main password comparision
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      return res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal server error");
    }
  }
);

// Route 4: for Fetching user data after log-in
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
