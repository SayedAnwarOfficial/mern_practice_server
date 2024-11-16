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
// User Sign In or Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user_model.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    const confirmPassword = await bcrypt.compare(password, user.password);

    if (confirmPassword) {
      // Generate JWT Token after successful login
      const token = await user.generateToken();

      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
        maxAge: 3600000, // 1 hour
      });

      return res.json({
        message: "Logged in successfully",
        userId: user._id.toString(),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};

// Logout (Clear cookies)
const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only clear cookies in production if secure
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};

module.exports = { register, login, logout };
