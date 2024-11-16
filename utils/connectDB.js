const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.error("Db connected failed", e.message);
    process.exit(1);
  }
};

module.exports = connectDB;
