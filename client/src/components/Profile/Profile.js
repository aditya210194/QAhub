'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '../services/authService';
import axios from "axios";
import './Profile.css';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaCode, FaSave, FaTimes, FaEdit, FaSignOutAlt, FaUpload } from 'react-icons/fa';

// ✅ ADD THIS CONSTANT
const DEFAULT_AVATAR_API = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=667eea&color=fff&size=128`;

const Profile = ({ setToken }) => {
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    // ✅ UPDATED: Better image fallback
    const getProfileImageUrl = useCallback(() => {
        // If image error or no profile picture, use avatar API
        if (imageError || !profile?.profilePicture) {
            return DEFAULT_AVATAR_API(profile?.username);
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        let imagePath = profile.profilePicture;

        if (imagePath.startsWith('http')) return imagePath;
        imagePath = imagePath.replace(/\\/g, '/');

        if (imagePath.includes('uploads/uploads/')) {
            imagePath = imagePath.replace('uploads/uploads/', 'uploads/');
        }

        let fullUrl;
        if (imagePath.startsWith('/')) {
            fullUrl = `${baseUrl}${imagePath}`;
        } else if (imagePath.startsWith('uploads/')) {
            fullUrl = `${baseUrl}/${imagePath}`;
        } else {
            fullUrl = `${baseUrl}/uploads/profile_pictures/${imagePath.split('/').pop()}`;
        }

        return fullUrl;
    }, [profile?.profilePicture, imageError, profile?.username]);

    useEffect(() => {
        const abortController = new AbortController();
        const token = sessionStorage.getItem('token');
        const cachedProfile = sessionStorage.getItem('cachedProfile');
        const cacheTime = sessionStorage.getItem('profileCacheTime');
        const now = Date.now();

        if (cachedProfile && cacheTime && (now - parseInt(cacheTime) < 300000)) {
            try {
                const parsedProfile = JSON.parse(cachedProfile);
                setProfile(parsedProfile);
                setUpdatedProfile({
                    ...parsedProfile,
                    experience: parsedProfile.experience || [],
                    experienceLevel: parsedProfile.experienceLevel || "",
                    skills: Array.isArray(parsedProfile.skills) ? parsedProfile.skills : [],
                });
                setLoading(false);
                return;
            } catch (err) {
                console.error('Error parsing cached profile:', err);
            }
        }

        if (token) {
            const fetchProfile = async () => {
                try {
                    const response = await fetchUserProfile(token, { signal: abortController.signal });
                    sessionStorage.setItem('cachedProfile', JSON.stringify(response));
                    sessionStorage.setItem('profileCacheTime', Date.now().toString());
                    setProfile(response);
                    setUpdatedProfile({
                        ...response,
                        experience: response.experience || [],
                        experienceLevel: response.experienceLevel || "",
                        skills: Array.isArray(response.skills) ? response.skills : [],
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Profile fetch error:', err);
                        showAlert('error', 'Failed to load profile. Please try again.');
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            router.push('/login');
        }

        return () => abortController.abort();
    }, [router]);

    useEffect(() => {
        const handleTokenChange = () => {
            const newToken = sessionStorage.getItem('token');
            setToken(newToken);
            if (!newToken) {
                router.push('/login');
            }
        };
        window.addEventListener('storage', handleTokenChange);
        return () => window.removeEventListener('storage', handleTokenChange);
    }, [setToken, router]);

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
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showAlert('error', 'Please upload a valid image file (JPEG, PNG, GIF)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showAlert('error', 'Image size should be less than 5MB');
                return;
            }
            setProfilePic(file);
            setImageError(false);
        }
    };

    const handleSaveChanges = async () => {
        try {
            setUploading(true);

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

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const response = await axios.put(
                `${API_URL}/api/profile`,
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
                sessionStorage.removeItem('cachedProfile');
                sessionStorage.removeItem('profileCacheTime');
                const refreshedProfile = await fetchUserProfile(token);
                setProfile(refreshedProfile);
                setUpdatedProfile({
                    ...refreshedProfile,
                    skills: Array.isArray(refreshedProfile.skills) ? refreshedProfile.skills : [],
                });
                setEditMode(false);
                setProfilePic(null);
                setImageError(false);
            }
        } catch (err) {
            console.error("Error saving changes:", err.response ? err.response.data : err.message);
            showAlert('error', err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setUpdatedProfile({
            ...profile,
            skills: Array.isArray(profile.skills) ? profile.skills : [],
        });
        setEditMode(false);
        setProfilePic(null);
        setImageError(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('cachedProfile');
        sessionStorage.removeItem('profileCacheTime');
        setProfile({});
        setUpdatedProfile({});
        setToken(null);
        router.push('/login');
        window.dispatchEvent(new Event('storage'));
        showAlert('success', 'Logged out successfully!');
    };

    const handleImageError = () => {
        console.log('🖼️ Image failed to load, using fallback');
        setImageError(true);
        setImageLoaded(false);
    };

    const handleImageLoad = () => {
        console.log('🖼️ Image loaded successfully');
        setImageLoaded(true);
        setImageError(false);
    };

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

            {profile && Object.keys(profile).length > 0 ? (
                <div className="profile-card">
                    {editMode ? (
                        <div className="profile-card-body">
                            <div className="profile-card-header">
                                <h5><FaEdit /> Edit Profile</h5>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="edit-form">
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" name="username" value={updatedProfile.username || ''} onChange={handleInputChange} required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" name="fullName" value={updatedProfile.fullName || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={updatedProfile.email || ''} onChange={handleInputChange} required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control" name="bio" value={updatedProfile.bio || ''} onChange={handleInputChange} rows="3" placeholder="Tell us about yourself..." />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input type="text" className="form-control" name="location" value={updatedProfile.location || ''} onChange={handleInputChange} placeholder="City, Country" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Experience Level</label>
                                    <select className="form-control" name="experienceLevel" value={updatedProfile.experienceLevel || ''} onChange={handleInputChange}>
                                        <option value="">Select experience level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Skills (comma separated)</label>
                                    <input type="text" className="form-control" name="skills" value={updatedProfile.skills?.join(', ') || ''} onChange={handleInputChange} placeholder="React, JavaScript, Node.js, Python" />
                                    <small className="form-text text-muted">Enter your skills separated by commas</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Profile Picture</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="profile-pic" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                                        <label htmlFor="profile-pic" className="file-input-label"><FaUpload /> Choose an image</label>
                                    </div>
                                    {profilePic && (
                                        <div className="profile-pic-preview">
                                            <img src={URL.createObjectURL(profilePic)} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px' }} />
                                            <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>New image selected</p>
                                        </div>
                                    )}
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="profile-btn profile-btn-primary" onClick={handleSaveChanges} disabled={uploading}>
                                        <FaSave /> {uploading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" className="profile-btn profile-btn-secondary" onClick={handleCancel} disabled={uploading}>
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="profile-card-body">
                            <div className="profile-avatar-container">
                                {!imageLoaded && !imageError && (
                                    <div className="avatar-loading">
                                        <div className="spinner-small"></div>
                                    </div>
                                )}
                                <img
                                    key={profile.profilePicture || 'default'}
                                    src={getProfileImageUrl()}
                                    alt={profile.username || "User"}
                                    className={`profile-avatar ${imageLoaded ? 'loaded' : 'loading'}`}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    style={{ display: 'block' }}
                                    crossOrigin="anonymous"
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

                            <div className="profile-info-item full-width">
                                <span className="profile-info-label">Bio</span>
                                <span className="profile-info-value">{profile.bio || 'No bio provided'}</span>
                            </div>

                            <div className="profile-info-item full-width">
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
                    )}
                </div>
            ) : (
                <div className="profile-loading">
                    <p>No profile data found. Please complete your profile.</p>
                    <button className="btn btn-primary mt-3" onClick={() => setEditMode(true)}>
                        Complete Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;