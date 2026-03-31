import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validation
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
                { email },
                { timeout: 10000 } // 10 seconds timeout
            );

            if (response.status === 200) {
                setMessage('Password reset link has been sent to your email. Redirecting...');
                setTimeout(() => navigate('/reset-password'), 3000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Network error. Please try again later.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page min-vh-100 d-flex align-items-center bg-light">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-3">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary mb-3">Forgot Password?</h2>
                                <p className="text-muted">
                                    Enter your email and we'll send you a link to reset your password
                                </p>
                            </div>

                            {message && (
                                <div className="alert alert-success d-flex align-items-center">
                                    <div className="flex-grow-1">{message}</div>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger d-flex align-items-center">
                                    <div className="flex-grow-1">{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FiMail className="text-muted" />
                                        </span>
                                        <input
                                            type="email"
                                            className={`form-control ${error && !message ? 'is-invalid' : ''}`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.trim())}
                                            placeholder="your@email.com"
                                            required
                                            autoFocus
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-semibold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link <FiArrowRight className="ms-2" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => navigate('/login')}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;