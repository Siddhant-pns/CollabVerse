import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getAuthData, getUserProfile, getAllUsers } from "../services/api";
import "../styles/Chat.css";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch User Data & Redirect If Needed
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authRes = await getAuthData();
        if (!authRes.data.userId) {
          alert("User ID not found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const profileRes = await getUserProfile(authRes.data.userId);
        if (!profileRes.data.name || !profileRes.data.profilePic) {
          alert("Profile incomplete. Redirecting to profile setup.");
          navigate("/profile-setup");
        } else {
          setUser(profileRes.data);
        }
        // ✅ Fetch All Users
        const usersRes = await getAllUsers();
        setUsers(usersRes.data);
      } catch (error) {
        console.error("🔥 Error fetching user data:", error);
        alert("Error retrieving user details. Redirecting to login.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // ✅ Listen for Messages in Real Time
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // ✅ Send Message
  const sendMessage = () => {
    if (message.trim() === "" || !user) return;

    const newMessage = { sender: user._id, text: message };
    socket.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  // ✅ Handle Group Image Upload
  const handleGroupImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setGroupPic(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // ✅ Create Group
  const createGroup = () => {
    if (!groupName || !groupPic) {
      alert("Please enter a group name and upload a group image.");
      return;
    }
    console.log("Group Created:", { groupName, groupPic, isPrivate, password });
    setShowGroupDialog(false);
    setGroupName("");
    setGroupPic(null);
    setIsPrivate(false);
    setPassword("");
  };

  if (loading) return <p>Loading chat...</p>;

  return (
    <div className="chat-container">
      {/* 🔹 Top Bar */}
      <div className="top-bar">
        <div className="user-info">
          <img src={user?.profilePic} alt="User DP" className="profile-pic" />
          <span className="user-name">{user?.name}</span>
        </div>
        <input type="text" placeholder="Search..." className="search-bar" />
      </div>

      {/* 🔹 Main Chat Interface */}
      <div className="chat-main">
        {/* Left: Contacts List */}
        <div className="contact-list">
          <h3>Contacts / Groups</h3>
          <ul>
          {users.map((u) => (
              <li key={u.email} className="contact-item">
                <img src={u.profilePic || "https://via.placeholder.com/50"} alt="User DP" className="contact-pic" />
                <span className="contact-name">{u.name || "Unknown"}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Chat Section */}
        <div className="chat-section">
          <div className="messages">
            {messages.map((msg, index) => (
              <p key={index} className={msg.sender === user._id ? "my-message" : "other-message"}>
                {msg.text}
              </p>
            ))}
          </div>

          {/* 🔹 Chat Input */}
          <div className="message-input">
            <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>📩</button>
          </div>
        </div>
      </div>

      {/* 🔹 Toolbar for Creating Groups */}
      <div className="toolbar">
        <button className="add-group-btn" onClick={() => setShowGroupDialog(true)}>➕ Create Group</button>
      </div>

      {/* 🔹 Group Creation Dialog */}
      {showGroupDialog && (
        <div className="group-dialog">
          <h3>Create Group</h3>
          <input type="text" placeholder="Enter Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <input type="file" accept="image/*" onChange={handleGroupImageUpload} />
          {groupPic && <img src={groupPic} alt="Group Preview" className="group-pic" />}
          <label>
            <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
            Private Group
          </label>
          {isPrivate && <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />}
          <button onClick={createGroup}>Create</button>
          <button onClick={() => setShowGroupDialog(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
