const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  profilePic: String,
  refreshToken: String,  // ✅ Store refresh token
});

module.exports = mongoose.model("User", userSchema);
