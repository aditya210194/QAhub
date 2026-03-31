import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/Qahub_logo.svg';
import './Header.css';
import { getProfileImageUrl } from '../utils/imageUtils';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Store token and user state
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Detect Scroll for Navbar Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch User Data When Token Exists
    useEffect(() => {

        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => setUser(response.data))
                .catch(() => {
                    setUser(null);
                    setToken(null);
                    sessionStorage.removeItem('token');
                });
        } else {
            setUser(null);
        }
    }, [token]);

    // Listen for changes in sessionStorage across tabs/windows
    useEffect(() => {
        const handleTokenChange = () => {
            const newToken = sessionStorage.getItem('token');
            setToken(newToken); // Ensure token state is updated
        };

        window.addEventListener('storage', handleTokenChange);
        return () => window.removeEventListener('storage', handleTokenChange);
    }, []);

    // Toggle Dark Mode
    const toggleNightMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.body.classList.toggle('dark-mode', newMode);
    };


    // Toggle Mobile Menu
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className={`navbar navbar-expand-lg fixed-navbar ${scrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="QA Hub Logo" />
                </Link>

                {/* Mobile Menu Toggle */}
                <button className="navbar-toggler" type="button" onClick={toggleMobileMenu}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links */}
                <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto">
                        {['/', '/courses', '/articles', '/resources', '/about', '/contact'].map((path, index) => (
                            <li className="nav-item" key={index}>
                                <Link
                                    className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                                    to={path}
                                    onClick={closeMobileMenu}
                                >
                                    {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Night Mode Toggle */}
                    <button className="btn btn-toggle-mode ms-3" onClick={toggleNightMode}>
                        {isDarkMode ? '☀️ Day Mode' : '🌙 Night Mode'}
                    </button>

                    {/* Auth Buttons / User Avatar */}
                    {!token ? (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-link">
                                <button className="btn btn-primary auth-btn" onClick={closeMobileMenu}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/register" className="auth-link">
                                <button className="btn btn-outline-primary auth-btn" onClick={closeMobileMenu}>
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="auth-avatar">
                            <img
                                src={getProfileImageUrl(user?.profilePicture)}
                                alt="User Avatar"
                                className="avatar"
                                onClick={() => navigate('/profile')}
                            />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
