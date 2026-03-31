import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Profile.css';
import { getProfileImageUrl } from '../../utils/imageUtils';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaCode, FaSave, FaTimes, FaEdit, FaSignOutAlt, FaUpload } from 'react-icons/fa';

const Profile = ({ setToken }) => {
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        if (storedUser === 'undefined' || storedUser === 'null') {
            console.log('Cleaning up invalid user data');
            sessionStorage.removeItem('user');
        }

        if (token) {
            const fetchProfile = async () => {
                try {
                    const response = await fetchUserProfile(token);
                    console.log('Profile data received:', response);
                    setProfile(response);
                    setUpdatedProfile({
                        ...response,
                        experience: response.experience || [],
                        experienceLevel: response.experienceLevel || "",
                        skills: Array.isArray(response.skills) ? response.skills : [],
                    });
                } catch (err) {
                    console.error('Error fetching profile:', err.response?.data || err.message);
                    showAlert('error', 'Failed to load profile. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const handleTokenChange = () => {
            setToken(sessionStorage.getItem('token'));
        };

        window.addEventListener('storage', handleTokenChange);
        return () => window.removeEventListener('storage', handleTokenChange);
    }, [setToken]);

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'skills') {
            setUpdatedProfile((prevProfile) => ({
                ...prevProfile,
                [name]: typeof value === "string" ? value.split(',').map((skill) => skill.trim()) : [],
            }));
        } else {
            setUpdatedProfile((prevProfile) => ({
                ...prevProfile,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
        setImageError(false);
    };

    const handleSaveChanges = async () => {
        try {
            if (!updatedProfile || typeof updatedProfile !== "object") {
                showAlert('error', "Profile data is missing. Please refresh and try again.");
                return;
            }

            const skillsArray = Array.isArray(updatedProfile.skills) ? updatedProfile.skills : [];

            const formData = new FormData();
            formData.append('username', updatedProfile.username || "");
            formData.append('fullName', updatedProfile.fullName || "");
            formData.append('email', updatedProfile.email || "");
            formData.append('bio', updatedProfile.bio || "");
            formData.append('location', updatedProfile.location || "");
            formData.append('experienceLevel', updatedProfile.experienceLevel || "");
            formData.append('skills', skillsArray.join(','));

            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }

            const token = sessionStorage.getItem('token');
            if (!token) {
                showAlert('error', "User not authenticated. Please log in again.");
                return;
            }

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

            if (response.status === 200) {
                showAlert('success', "Profile updated successfully!");

                // Refresh the profile data
                const refreshedProfile = await fetchUserProfile(token);
                setProfile(refreshedProfile);
                setEditMode(false);
                setProfilePic(null);
                setImageError(false);
            }
        } catch (err) {
            console.error("Error saving changes:", err.response ? err.response.data : err.message);
            showAlert('error', "Failed to update profile. Please try again.");
        }
    };

    const handleCancel = () => {
        setUpdatedProfile(profile);
        setEditMode(false);
        setProfilePic(null);
        setImageError(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setProfile({});
        setUpdatedProfile({});
        setToken(null);
        navigate('/login');
        window.dispatchEvent(new Event('storage'));
        showAlert('success', 'Logged out successfully!');
    };

    const handleImageError = () => {
        console.log('Image failed to load, using default');
        setImageError(true);
        setImageLoaded(false);
    };

    const handleImageLoad = () => {
        console.log('Image loaded successfully');
        setImageLoaded(true);
        setImageError(false);
    };

    // Get profile image URL - simplified version
    const getProfileImageUrl = () => {
        if (imageError) {
            return '/default-profile-pic.jpg';
        }

        if (profile.profilePicture) {
            // If it's already a full URL, use it directly
            if (profile.profilePicture.startsWith('http')) {
                return profile.profilePicture;
            }

            // Construct the URL
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            // Handle different path formats
            let imagePath = profile.profilePicture;

            // Remove any backslashes
            imagePath = imagePath.replace(/\\/g, '/');

            // If it already has uploads in the path, use it as is
            if (imagePath.includes('uploads/')) {
                return `${baseUrl}/${imagePath}`;
            }

            // If it's just a filename, add the uploads path
            return `${baseUrl}/uploads/profile_pictures/${imagePath.split('/').pop()}`;
        }

        return '/default-profile-pic.jpg';
    };

    // Debug: Log the image URL whenever profile changes
    useEffect(() => {
        if (profile.profilePicture) {
            const url = getProfileImageUrl();
            console.log('Profile image URL:', url);

            // Test if the image loads
            const img = new Image();
            img.onload = () => console.log('Image preload successful:', url);
            img.onerror = () => console.log('Image preload failed:', url);
            img.src = url;
        }
    }, [profile.profilePicture]);

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-loading">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h2 className="profile-title">My Profile</h2>

            {alert.show && (
                <div className={`profile-alert profile-alert-${alert.type}`}>
                    {alert.type === 'success' ? '✓' : '⚠'} {alert.message}
                </div>
            )}

            {profile ? (
                <div className="profile-card">
                    {editMode ? (
                        <>
                            <div className="profile-card-header">
                                <h5><FaEdit /> Edit Profile</h5>
                            </div>
                            <div className="profile-card-body">
                                <form className="edit-form">
                                    <div className="form-group">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={updatedProfile.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={updatedProfile.fullName}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={updatedProfile.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            className="form-control"
                                            name="bio"
                                            value={updatedProfile.bio || ''}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="location"
                                            value={updatedProfile.location || ''}
                                            onChange={handleInputChange}
                                            placeholder="City, Country"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Experience Level</label>
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

                                    <div className="form-group">
                                        <label className="form-label">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="skills"
                                            value={updatedProfile.skills?.join(', ') || ''}
                                            onChange={handleInputChange}
                                            placeholder="React, JavaScript, Node.js"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Profile Picture</label>
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                id="profile-pic"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            <label htmlFor="profile-pic" className="file-input-label">
                                                <FaUpload /> Choose an image
                                            </label>
                                        </div>
                                        {profilePic && (
                                            <div className="profile-pic-preview">
                                                <img
                                                    src={URL.createObjectURL(profilePic)}
                                                    alt="Preview"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="profile-btn profile-btn-primary" onClick={handleSaveChanges}>
                                            <FaSave /> Save Changes
                                        </button>
                                        <button type="button" className="profile-btn profile-btn-secondary" onClick={handleCancel}>
                                            <FaTimes /> Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="profile-card-body">
                                <div className="profile-avatar-container">
                                    {!imageLoaded && !imageError && (
                                        <div className="avatar-loading">
                                            <div className="spinner-small"></div>
                                        </div>
                                    )}
                                   <img
                                       key={getProfileImageUrl(profile.profilePicture)}
                                       src={getProfileImageUrl(profile.profilePicture)}
                                       alt={profile.username || "User"}
                                       className={`profile-avatar ${imageLoaded ? 'loaded' : 'loading'}`}
                                       onError={handleImageError}
                                       onLoad={handleImageLoad}
                                       style={{ display: 'block' }}
                                   />
                                </div>

                                <h3 className="profile-username">{profile.username}</h3>

                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="profile-info-label"><FaUser /> Full Name</span>
                                        <span className="profile-info-value">{profile.fullName || 'Not provided'}</span>
                                    </div>

                                    <div className="profile-info-item">
                                        <span className="profile-info-label"><FaEnvelope /> Email</span>
                                        <span className="profile-info-value">{profile.email}</span>
                                    </div>

                                    <div className="profile-info-item">
                                        <span className="profile-info-label"><FaMapMarkerAlt /> Location</span>
                                        <span className="profile-info-value">{profile.location || 'Not provided'}</span>
                                    </div>

                                    <div className="profile-info-item">
                                        <span className="profile-info-label"><FaBriefcase /> Experience Level</span>
                                        <span className="profile-info-value">{profile.experienceLevel || 'Not provided'}</span>
                                    </div>
                                </div>

                                <div className="profile-info-item">
                                    <span className="profile-info-label">Bio</span>
                                    <span className="profile-info-value">{profile.bio || 'No bio provided'}</span>
                                </div>

                                <div className="profile-info-item">
                                    <span className="profile-info-label"><FaCode /> Skills</span>
                                    <div className="profile-skills">
                                        {profile.skills && profile.skills.length > 0 ? (
                                            profile.skills.map((skill, index) => (
                                                <span key={index} className="skill-badge">{skill}</span>
                                            ))
                                        ) : (
                                            <span className="profile-info-value empty">No skills added</span>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-actions">
                                    <button className="profile-btn profile-btn-warning" onClick={() => setEditMode(true)}>
                                        <FaEdit /> Edit Profile
                                    </button>
                                    <button className="profile-btn profile-btn-danger" onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="profile-loading">
                    <p>No profile data found.</p>
                </div>
            )}
        </div>
    );
};
 

export default Profile;