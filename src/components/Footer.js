// src/components/Footer.js
import './Footer.css'; // Import the CSS file
import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} EduAdda. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
