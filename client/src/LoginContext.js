// src/context/LoginContext.js
import React, { createContext, useState, useEffect } from 'react';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status in sessionStorage when the app loads
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        setIsLoggedIn(!!token); // Convert token presence to boolean
    }, []);

    // Function to log in
    const login = (token) => {
        sessionStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    };

    // Function to log out
    const logout = () => {
        sessionStorage.removeItem('authToken');
        setIsLoggedIn(false);
    };

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export { LoginContext, LoginProvider };
