import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaSignature } from 'react-icons/fa';
import './Register.css';
import SecondHeader from "../../pages/SecondHeader";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Calculate password strength when password changes
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;

        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(Math.min(strength, 5));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate all fields
        if (!formData.username || !formData.fullName || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate password strength
        if (passwordStrength < 3) {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser(formData);

            if (data?.token) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                window.dispatchEvent(new Event("storage"));
                navigate('/profile');
            } else {
                throw new Error("Registration failed - no token received");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
    <>
                <SecondHeader />
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Join Our Community</h2>
                    <p>Create your account to start your learning journey</p>
                </div>

                {error && (
                    <div className="register-error">
                        <div className="error-icon">!</div>
                        <div className="error-message">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">
                            <FaUser className="label-icon" /> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="e.g., johndoe123"
                            required
                            minLength="3"
                            maxLength="20"
                            pattern="[a-zA-Z0-9]+"
                            title="Only letters and numbers allowed"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">
                            <FaSignature className="label-icon" /> Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope className="label-icon" /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <FaLock className="label-icon" /> Password
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                required
                                minLength="8"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="password-strength">
                            <div
                                className={`strength-bar ${passwordStrength > 0 ? 'active' : ''}`}
                                data-strength="very-weak"
                            ></div>
                            <div
                                className={`strength-bar ${passwordStrength > 1 ? 'active' : ''}`}
                                data-strength="weak"
                            ></div>
                            <div
                                className={`strength-bar ${passwordStrength > 2 ? 'active' : ''}`}
                                data-strength="medium"
                            ></div>
                            <div
                                className={`strength-bar ${passwordStrength > 3 ? 'active' : ''}`}
                                data-strength="strong"
                            ></div>
                            <div
                                className={`strength-bar ${passwordStrength > 4 ? 'active' : ''}`}
                                data-strength="very-strong"
                            ></div>
                            <div className="strength-label">
                                {passwordStrength === 0 && 'Very weak'}
                                {passwordStrength === 1 && 'Weak'}
                                {passwordStrength === 2 && 'Fair'}
                                {passwordStrength === 3 && 'Good'}
                                {passwordStrength === 4 && 'Strong'}
                                {passwordStrength === 5 && 'Very strong'}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="terms-agreement">
                    By registering, you agree to our <Link to="/terms-and-conditions">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                </div>

                <div className="login-redirect">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    </>
    );
};

export default Register;