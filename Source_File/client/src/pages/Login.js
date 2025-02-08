import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveAuthData } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);

      if (res.data.user && res.data.user._id) {
        // ✅ Save token, userId, and email
        await saveAuthData(res.data.token, res.data.user._id, res.data.user.email);

        // ✅ Redirect based on profile completion
        if (!res.data.user.name || !res.data.user.profilePic) {
          navigate("/profile-setup"); // ✅ Go to Profile Setup
        } else {
          navigate("/chat"); // ✅ Go to Chat if profile exists
        }
      } else {
        alert("Error: User ID missing from server response.");
      }
    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/register")}>Register</span></p>
    </div>
  );
};

export default Login;
