// src/components/Footer.js
import './Footer.css'; // Import the CSS file
import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} QA Hub. All Rights Reserved. |
                    <a href="/privacy-policy">Privacy Policy</a> |
                    <a href="/terms-and-conditions">Terms & Conditions</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
