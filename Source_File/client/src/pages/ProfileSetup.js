import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, getAuthData } from "../services/api";

const ProfileSetup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // ✅ Fetch User Data (Email & User ID)
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const res = await getAuthData();
        if (!res.data.userId) {
          alert("User ID not found. Please login again.");
          navigate("/login");
        } else {
          setUserId(res.data.userId);
          setEmail(res.data.email || ""); // ✅ Ensure email is retrieved
        }
      } catch (error) {
        console.error("Error fetching auth data:", error);
        alert("Error retrieving user details. Please login again.");
        navigate("/login");
      }
    };

    fetchAuthData();
  }, [navigate]);

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result); // Convert image to base64
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // ✅ Submit Profile Data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Error: User ID is missing. Please login again.");
      navigate("/login");
      return;
    }

    if (!name || !profilePic) {
      alert("Please enter your name and select a profile picture.");
      return;
    }

    try {
      const response = await updateUserProfile(userId, { name, profilePic });
      console.log("Profile Update Response:", response.data);
      alert("Profile setup successful! Redirecting to chat...");
      navigate("/chat"); // ✅ Redirect to Chat Page
    } catch (err) {
      console.error("Profile Update Error:", err.response ? err.response.data : err.message);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Set Up Your Profile</h2>
      <p><strong>Email:</strong> {email}</p> {/* ✅ Show User Email */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br /><br />
        <input type="file" accept="image/*" onChange={handleImageUpload} required />
        <br /><br />
        {profilePic && <img src={profilePic} alt="Profile Preview" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />}
        <br /><br />
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
