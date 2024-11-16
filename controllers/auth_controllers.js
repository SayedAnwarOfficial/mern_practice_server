const user_model = require("../models/user_model");
const bcrypt = require("bcrypt");

// User Sign Up or Register
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingEmail = await user_model.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await user_model.create({ username, password, email });

    // Generate JWT Token after successful registration
    const token = await newUser.generateToken();

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id.toString(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};

module.exports = { register };

