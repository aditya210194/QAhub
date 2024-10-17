import React from 'react';
import { Link } from 'react-router-dom';
import logo from 'C:/Users/AdityaPP/software-testing-edu/src/Logo.webp'; // Update the path according to where you store your
import './Header.css'; // Import the CSS file

const Header = () => {
    return (
        <nav  className="navbar navbar-expand-lg navbar-dark bg-dark fixed-header">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="EduAdda Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    EduAdda
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/courses">Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/articles">Articles</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/resources">Resources</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">About
                                Us</Link> {/* Ensure path matches your route */}
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;