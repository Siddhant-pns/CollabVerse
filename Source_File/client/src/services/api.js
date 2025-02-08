import axios from "axios";

// ✅ Set up Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Automatically attach JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Register User
export const registerUser = (email, password) =>
  API.post("/auth/register", { email, password });

// ✅ Login User
export const loginUser = (email, password) =>
  API.post("/auth/login", { email, password });

// ✅ Logout User (Remove Token)
export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const updateUserProfile = (userId, data) => API.put(`/auth/profile/${userId}`, data);

// ✅ Get user profile
export const getUserProfile = (userId) => API.get(`/auth/profile/${userId}`);

// ✅ Get user chats (Groups & Private)
export const getChatList = (userId) => API.get(`/chats/${userId}`);

// ✅ Save Auth Data to Backend File
export const saveAuthData = (token, userId) =>
  API.post("/auth-storage/save-auth", { token, userId });

// ✅ Get Auth Data from Backend File
export const getAuthData = () => API.get("/auth-storage/get-auth");

// ✅ Clear Auth Data
export const clearAuthData = () => API.delete("/auth-storage/clear-auth");

// ✅ Get All Users
export const getAllUsers = () => API.get("/auth/users");
