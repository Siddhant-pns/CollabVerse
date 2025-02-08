const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const User = require("../models/User");

const router = express.Router();
const userFilePath = "C:/CollabVerse/users.json"; // ✅ Ensure users are also stored in this file

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate Email & Password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Received Registration Request:", { email });

    // ✅ Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user in MongoDB (Default empty `name` & `profilePic`)
    const newUser = new User({ email, password: hashedPassword, name: "", profilePic: "" });
    await newUser.save();

    console.log("✅ User Registered in MongoDB:", newUser);

    // ✅ Save User in `users.json` (Ensuring File Consistency)
    try {
      let users = [];
      const exists = await fs.access(userFilePath).then(() => true).catch(() => false);
      if (exists) {
        const fileData = await fs.readFile(userFilePath, "utf8");
        users = fileData.trim() ? JSON.parse(fileData) : [];
      }

      // ✅ Append new user to `users.json`
      users.push({ email, name: "", profilePic: "" });
      await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));

      console.log("✅ User Data Saved in File:", userFilePath);
    } catch (error) {
      console.error("🔥 Error saving user data to file:", error);
    }

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("🔥 Registration Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate Email & Password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { _id: user._id, email: user.email, name: user.name, profilePic: user.profilePic } });
  } catch (err) {
    console.error("🔥 Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ✅ Update User Profile (Syncs with MongoDB & `users.json`)
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, profilePic } = req.body;

    // ✅ Validate Name & Profile Pic
    if (!name || !profilePic) {
      return res.status(400).json({ error: "Name and profile picture are required" });
    }

    // ✅ Check if user exists before updating
    const user = await User.findByIdAndUpdate(req.params.id, { name, profilePic }, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    // ✅ Update user data in `users.json`
    try {
      let users = [];
      const exists = await fs.access(userFilePath).then(() => true).catch(() => false);
      if (exists) {
        const fileData = await fs.readFile(userFilePath, "utf8");
        users = JSON.parse(fileData);
      }

      // ✅ Find and update the user in `users.json`
      users = users.map((u) => (u.email === user.email ? { ...u, name, profilePic } : u));
      await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));

      console.log("✅ Profile Updated in users.json");
    } catch (error) {
      console.error("🔥 Error updating user in users.json:", error);
    }

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error("🔥 Profile Update Error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("🔥 Profile Fetch Error:", err);
    res.status(500).json({ error: "Server error fetching user profile" });
  }
});

// ✅ Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "email name profilePic");
    res.json(users);
  } catch (err) {
    console.error("🔥 Error fetching users:", err);
    res.status(500).json({ error: "Server error fetching users" });
  }
});

module.exports = router;
