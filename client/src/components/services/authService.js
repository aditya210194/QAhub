import axios from 'axios';

// ✅ CHANGE: Use NEXT_PUBLIC_API_URL for Next.js
// ✅ Fallback to localhost:5000 if not set
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth`;
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Register User
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
    return response.data;
};

// Login User
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials, { withCredentials: true });

        console.log('=== LOGIN API RESPONSE ===');
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Token:', response.data.token);
        console.log('User object:', response.data.user);
        console.log('User role:', response.data.user?.role);

        // Make sure we're returning both token and user
        if (response.data.token && response.data.user) {
            return {
                token: response.data.token,
                user: response.data.user
            };
        }

        // If the response structure is different, handle it
        if (response.data.token) {
            return {
                token: response.data.token,
                user: response.data.user || response.data
            };
        }

        return response.data;
    } catch (error) {
        console.error('Login API error:', error.response?.data);
        throw error.response?.data?.message || "Login failed";
    }
};

// ✅ FIX: Use BASE_API_URL instead of REACT_APP_API_URL
export const fetchUserProfile = async (token) => {
    console.log("📡 Fetching Profile with Token:", token ? 'Present' : 'Missing');
    console.log("📡 API URL:", `${BASE_API_URL}/api/profile`);

    const response = await axios.get(`${BASE_API_URL}/api/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ✅ FIX: Use BASE_API_URL instead of REACT_APP_API_URL
export const updateUserProfile = async (token, formData) => {
    try {
        const response = await axios.put(`${BASE_API_URL}/api/profile`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const logoutUser = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.location.href = "/login";
};