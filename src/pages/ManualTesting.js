// src/pages/ManualTesting.js
import React from 'react';

import SecondHeader from "./SecondHeader";

const ManualTesting = () => {
    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader />
            <h1>Manual Testing</h1>
            <p>
                Manual testing is a process in which testers manually execute test cases without using any
                automation tools. It is essential for understanding user interactions and detecting usability issues.
            </p>
            <h3>Manual Testing Process</h3>
            <ul>
                <li>Requirement analysis</li>
                <li>Test case creation</li>
                <li>Test case execution</li>
                <li>Bug reporting</li>
            </ul>
            <p>
                Manual testing is often used in exploratory, usability, and ad-hoc testing scenarios where human
                intervention is required to gauge the application's response.
            </p>
        </div>
    );
};

export default ManualTesting;
