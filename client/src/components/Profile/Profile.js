import React, { useEffect, useState } from 'react';
import { fetchUserProfile} from '../services/authService';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Profile = ({ setToken }) => {
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            console.log("Fetching profile with token:", token);
            const fetchProfile = async () => {
                try {
                    const response = await fetchUserProfile(token);
                    console.log('Profile Response:', response); // ✅ Log API response
                    // Ensure response contains experienceLevel and skills
                    if (response && response.experienceLevel) {
                        console.log("Experience Level:", response.experienceLevel);
                    }

                    if (response && response.skills) {
                        console.log("Skills:", response.skills);
                    }

                    setProfile(response);
                    setUpdatedProfile({
                        ...response,
                        experience: response.experience || [],  // ✅ Ensure experience is always an array
                        experienceLevel: response.experienceLevel || "",  // ✅ Ensure experienceLevel is always a string
                        skills: Array.isArray(response.skills) ? response.skills : [],  // ✅ Ensure skills is always an array
                    });
                } catch (err) {
                    console.error('Error fetching profile:', err.response?.data || err.message);
                }
            };
            fetchProfile();
        } else {
            navigate('/login');
        }
    }, []);
    useEffect(() => {
        const handleTokenChange = () => {
            setToken(sessionStorage.getItem('token')); // Update token state dynamically
        };

        window.addEventListener('storage', handleTokenChange);
        return () => window.removeEventListener('storage', handleTokenChange);
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle skills array separately
        if (name === 'skills') {
            setUpdatedProfile((prevProfile) => ({
                ...prevProfile,
                [name]: typeof value === "string" ? value.split(',').map((skill) => skill.trim()) : [],  // ✅ Ensure proper conversion
            }));
        } else {
            // Handle regular input fields
            setUpdatedProfile((prevProfile) => ({
                ...prevProfile,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
    };

    const handleSaveChanges = async () => {
        try {
            console.log("Save Changes button clicked");

            if (!updatedProfile || typeof updatedProfile !== "object") {
                console.error("updatedProfile is undefined or not an object");
                alert("Profile data is missing. Please refresh and try again.");
                return;
            }

            // Ensure skills is always an array
            const skillsArray = Array.isArray(updatedProfile.skills) ? updatedProfile.skills : [];

            const formData = new FormData();
            formData.append('username', updatedProfile.username || "");
            formData.append('fullName', updatedProfile.fullName || "");
            formData.append('email', updatedProfile.email || "");
            formData.append('bio', updatedProfile.bio || "");
            formData.append('location', updatedProfile.location || "");
            formData.append('experienceLevel', updatedProfile.experienceLevel || "");
            formData.append('skills', skillsArray.join(',')); // Prevent undefined error

            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }

            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error("No auth token found!");
                alert("User not authenticated. Please log in again.");
                return;
            }

            console.log("Sending API request with data:", Object.fromEntries(formData));

            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log("Response received:", response);

            if (response.status === 200) {
                console.log("Profile updated successfully:", response.data);
                setProfile({
                    ...updatedProfile,
                    profilePicture: response.data.profilePicture,  // ✅ Ensure updated profile picture reflects in UI
                    experienceLevel: response.data.user.experienceLevel,  // Make sure experienceLevel is updated
                    skills: response.data.user.skills,  // Make sure skills are updated
                });
                setEditMode(false);  // Exit edit mode
                setProfilePic(null);  // Reset file input
                alert("Profile updated successfully!");
            }
        } catch (err) {
            console.error("Error saving changes:", err.response ? err.response.data : err.message);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleCancel = () => {
        setUpdatedProfile(profile); // Revert changes if the user cancels
        setEditMode(false);
        setProfilePic(null);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token'); // ✅ Clear token
        setProfile({});  // ✅ Reset profile state
        setUpdatedProfile({});

        // Force a re-render by updating state
        setToken(null);

        navigate('/login'); // Redirect to login

        // Dispatch a custom event to notify other components of the logout
        window.dispatchEvent(new Event('storage'));
    };


    return (
        <div className="container mt-4">
            <h2 className="text-center">Profile</h2>
            {profile ? (
                <>
                    {editMode ? (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Edit Profile</h5>
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={updatedProfile.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Full Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={updatedProfile.fullName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={updatedProfile.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Bio:</label>
                                        <textarea
                                            className="form-control"
                                            name="bio"
                                            value={updatedProfile.bio || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Location:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="location"
                                            value={updatedProfile.location || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Experience Level:</label>
                                        <select
                                            className="form-control"
                                            name="experienceLevel"
                                            value={updatedProfile.experienceLevel || ''}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Skills (comma separated):</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="skills"
                                            value={updatedProfile.skills?.join(', ') || ''}  // ✅ Ensure proper formatting
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Profile Picture:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleFileChange}
                                        />
                                        {profilePic && (
                                            <img
                                                src={profile.profilePicture
                                                    ? `${process.env.REACT_APP_API_URL}/${profile.profilePicture.replace(/\\/g, '/')}`  // ✅ Ensure proper URL format
                                                    : '/default-profile-pic.jpg'}
                                                alt="Profile"
                                                width={100}
                                                className="rounded-circle mb-3"
                                            />
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                                        Save Changes
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body text-center">
                                <img
                                    src={profile.profilePicture
                                        ? `${process.env.REACT_APP_API_URL}/${profile.profilePicture.replace('\\', '/')}`
                                        : '/default-profile-pic.jpg'}
                                    alt="Profile"
                                    width={100}
                                    className="rounded-circle mb-3"
                                />

                                <h4>{profile.username}</h4>
                                <p><strong>Full Name:</strong> {profile.fullName}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Bio:</strong> {profile.bio || 'Not provided'}</p>
                                <p><strong>Location:</strong> {profile.location || 'Not provided'}</p>
                                <p><strong>Experience Level:</strong> {profile.experienceLevel || 'Not provided'}</p>
                                <p>
                                    <strong>Skills:</strong> {profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : 'Not provided'}
                                </p>
                                <div>
                                    <button className="btn btn-warning" onClick={() => setEditMode(true)}>
                                        Edit Profile
                                    </button>
                                    <button className="btn btn-danger ms-3" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
