import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate,  useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaUser, FaLock } from 'react-icons/fa';
import './Login.css';
import SecondHeader from "../../pages/SecondHeader";
import loginHeroImg from '../../images/login-hero.jpg';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const redirectTo = searchParams.get('next') || '/profile';
    console.log('Login page - redirectTo:', redirectTo);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const isValidRedirect = (url) => {
             if (!url) return false;
             // Allow only relative URLs starting with '/', no external domains or "//"
             return url.startsWith('/') && !url.includes('//') && !url.includes('\\');
         };

   const handleSubmit = async (e) => {
       e.preventDefault();
       if (!credentials.email || !credentials.password) {
           setError('Both fields are required');
           return;
       }

       setError('');
       setLoading(true);

       try {
           const data = await loginUser(credentials);
           if (!data.token) throw new Error("No token received from server");

           sessionStorage.setItem('token', data.token);
           sessionStorage.setItem('user', JSON.stringify(data.user));
           // Also store in localStorage for persistence
           localStorage.setItem('user', JSON.stringify(data.user));
           window.dispatchEvent(new Event("storage"));

           // Check if user is Admin and redirect accordingly
           if (data.user && data.user.role === 'Admin') {
               console.log('Admin user detected, redirecting to /admin');
               navigate('/admin');
           } else {
               // Validate and navigate only once for non-admin users
               const safeRedirect = isValidRedirect(redirectTo) ? redirectTo : '/profile';
               navigate(safeRedirect);
           }
       } catch (err) {
           setError(err.response?.data?.message || 'Invalid credentials');
       } finally {
           setLoading(false);
       }
   };

    // Demo social login handlers
    const handleGoogleLogin = () => {
        console.log("Google login clicked");
        /* Implement actual Google OAuth here
        import { GoogleLogin } from '@react-oauth/google';

                                              <GoogleLogin
                                                onSuccess={credentialResponse => {
                                                  console.log(credentialResponse);
                                                }}
                                                onError={() => {
                                                  console.log('Login Failed');
                                                }}

                                         />   */
    };

    const handleGithubLogin = () => {
        console.log("GitHub login clicked");
        // Implement actual GitHub OAuth here
    };

    return (
     <>
            <SecondHeader />
        <div className="login-container">

            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue your learning journey</p>
                </div>

                {error && (
                    <div className="login-error">
                        <div className="error-icon">!</div>
                        <div className="error-message">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <FaUser className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="password-label-row">
                            <label htmlFor="password">Password</label>
                            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                        </div>
                        <div className="input-with-icon">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
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
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button
                        type="button"
                        className="social-button google"
                        onClick={handleGoogleLogin}
                    >
                        <FaGoogle className="social-icon" />
                        Google
                    </button>
                    <button
                        type="button"
                        className="social-button github"
                        onClick={handleGithubLogin}
                    >
                        <FaGithub className="social-icon" />
                        GitHub
                    </button>
                </div>

                <div className="signup-link">
                    Don't have an account? <a href="/register">Sign up</a>
                </div>
            </div>

            <div
                                className="login-graphics"
                               style={{
                                   backgroundImage: `url(${loginHeroImg})`,
                                   backgroundSize: 'cover',
                                   backgroundPosition: 'center',
                                   backgroundRepeat: 'no-repeat'
                               }}
                            >
                <div className="graphic-content">
                    <div className="graphic-text">
                        <h2>QA Learning Hub</h2>
                        <p>Master software testing with our comprehensive courses and expert instructors</p>
                    </div>
                    <div className="graphic-image"></div>
                </div>
            </div>
        </div>
     </>
    );
};

export default Login;