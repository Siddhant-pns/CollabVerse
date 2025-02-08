import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/Login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 400) {
        alert("User already exists. Try another email.");
      } else {
        alert("Error registering user. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
      <p>Have an account? <span onClick={() => navigate("/login")}>Log in</span></p>
    </div>
  );
};

export default Register;
