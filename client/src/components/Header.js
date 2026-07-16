'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import './Header.css';
import { getProfileImageUrl } from '../utils/imageUtils';

const logo = '/Qahub_logo.svg';

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [token, setToken] = useState(
        typeof window !== 'undefined' ? sessionStorage.getItem('token') || null : null
    );
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false
    );
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (token) {
            // Try to get user from session storage first
            const storedUser = sessionStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    console.log('📦 Header - User from session:', parsedUser);
                    setUser(parsedUser);
                } catch (e) {
                    console.warn('⚠️ Could not parse user from session');
                }
            }

            // Also fetch fresh profile to update avatar
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    console.log('✅ Header - Profile fetched:', response.data);
                    setUser(response.data);
                    // Update session storage with fresh data
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                })
                .catch((err) => {
                    console.error('❌ Header - Error fetching profile:', err);
                });
        } else {
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        const handleTokenChange = () => {
            const newToken = sessionStorage.getItem('token');
            setToken(newToken);
            if (!newToken) {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleTokenChange);
        return () => window.removeEventListener('storage', handleTokenChange);
    }, []);

    const toggleNightMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.body.classList.toggle('dark-mode', newMode);
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // ✅ Get profile image URL with fallback
    const getAvatarUrl = () => {
        if (!user?.profilePicture) {
            // Use username for avatar fallback
            const name = user?.username || 'User';
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=128`;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        let imagePath = user.profilePicture;

        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('uploads/')) {
            return `${baseUrl}/${imagePath}`;
        }
        if (imagePath.startsWith('profile-')) {
            return `${baseUrl}/uploads/profile_pictures/${imagePath}`;
        }
        return `${baseUrl}/uploads/profile_pictures/${imagePath.split('/').pop()}`;
    };

    return (
        <nav className={`navbar navbar-expand-lg fixed-navbar ${scrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand" href="/">
                    <img src={logo} alt="QA Hub Logo" />
                </Link>

                {/* Mobile Menu Toggle */}
                <button className="navbar-toggler" type="button" onClick={toggleMobileMenu}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links */}
                <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto">
                        {[
                            { path: '/', label: 'Home' },
                            { path: '/courses', label: 'Courses' },
                            { path: '/resources', label: 'Resources' },
                            { path: '/about', label: 'About' },
                            { path: '/contact', label: 'Contact' }
                        ].map((item, index) => (
                            <li className="nav-item" key={index}>
                                <Link
                                    className={`nav-link ${pathname === item.path ? 'active' : ''}`}
                                    href={item.path}
                                    onClick={closeMobileMenu}
                                >
                                    {item.label}
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
                            <Link href="/login" className="auth-link" onClick={closeMobileMenu}>
                                <button className="btn btn-primary auth-btn">Login</button>
                            </Link>
                            <Link href="/register" className="auth-link" onClick={closeMobileMenu}>
                                <button className="btn btn-outline-primary auth-btn">Sign Up</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="auth-avatar d-flex align-items-center">
                            <img
                                src={getAvatarUrl()}
                                alt={user?.username || "User"}
                                className="avatar"
                                onClick={() => router.push('/profile')}
                                onError={(e) => {
                                    // Fallback if image fails
                                    const name = user?.username || 'User';
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=128`;
                                }}
                            />
                            <span className="ms-2 d-none d-md-inline" style={{ color: isDarkMode ? '#e2e8f0' : '#2d3748' }}>
                                {user?.username || 'User'}
                            </span>
                            {/* ✅ REMOVED LOGOUT BUTTON FROM HEADER */}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;