const express = require("express");
const http = require("http"); // Required for WebSocket server
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend connection
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Register API Routes (IMPORTANT: Before `server.listen`)
const authRoutes = require("./routes/auth");  // ✅ Fixed missing auth route
app.use("/api/auth", authRoutes); 
const authStorageRoutes = require("./routes/authStorage");

app.use("/api/auth", authRoutes);
app.use("/api/auth-storage", authStorageRoutes);

// ✅ Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log("⚡ A user connected: " + socket.id);

  // ✅ Handle receiving messages
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.emit("receive_message", data); // Broadcast to all clients
  });

  // ✅ Handle private messages
  socket.on("private_message", ({ sender, receiver, message }) => {
    console.log(`Private Message from ${sender} to ${receiver}: ${message}`);
    socket.to(receiver).emit("receive_private_message", { sender, message });
  });

  // ✅ Handle user disconnection
  socket.on("disconnect", () => {
    console.log("⚡ User disconnected: " + socket.id);
  });
});

// ✅ Start the Server (AFTER Registering Routes)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
