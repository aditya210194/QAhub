import React from 'react';
import { Link } from 'react-router-dom';
import './SecondHeader.css'; // Assuming you want to create a separate CSS file for styling

const SecondHeader = () => {
    return (
        <nav className="fixed-second-header">
            <ul className="nav-list">
                <li><Link to="/automation-testing">Automation Testing</Link></li>
                <li><Link to="/manual-testing">Manual Testing</Link></li>
                <li><Link to="/agile">Agile</Link></li>
                <li><Link to="/interview-qa">Interview Q&A</Link></li>
                <li><Link to="/resumes">Resumes</Link></li>
            </ul>
        </nav>
    );
};

export default SecondHeader;
