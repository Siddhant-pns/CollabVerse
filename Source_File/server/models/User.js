const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "" }, // ✅ Default Empty Name
    profilePic: { type: String, default: "" }, // ✅ Default Empty Profile Picture
  },
  { timestamps: true } // ✅ Adds `createdAt` & `updatedAt`
);

module.exports = mongoose.model("User", userSchema);
