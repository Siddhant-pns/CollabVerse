// src/App.js
import React from "react";
import {Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/chat";
import ProfileSetup from "./pages/ProfileSetup";

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile-setup" element={<ProfileSetup />} /> 
      </Routes>
    </div>
    // <h2>hello</h2>
  );
}

export default App;
