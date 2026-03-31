import axios from 'axios';

// Base URL for your BE API
const API_URL = process.env.REACT_APP_API_URL + '/api/auth';

// Register User
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Login User
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

// Fetch User Profile
export const fetchUserProfile = async (token) => {
    console.log("Fetching Profile with Token:", token); // Debug
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;

};
// Update User Profile (including image upload)
export const updateUserProfile = async (token, formData) => {
    try{
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // For file uploads
        },
    });return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};
export const logoutUser = () => {
    sessionStorage.removeItem("authToken");
    window.location.href = "/"; // Redirect to home page or login page
};

