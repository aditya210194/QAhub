import React from 'react';
import SecondHeader from './SecondHeader';
import './SoftwareTesting.css'; // You can style this page separately

const SoftwareTesting = () => {
    return (
        <div className="software-testing-page">
            {/* Include the second header here */}
            <SecondHeader />
            <div className="container">
                <h1>Software Testing</h1>

                {/* Introduction Section */}
                <div className="section">
                    <h4>Introduction to Software Testing</h4>
                    <p>
                        Software Testing is the process of evaluating and verifying that a software application works as expected. It ensures that the software is free of defects and satisfies the requirements set by stakeholders.
                    </p>
                </div>

                {/* Types of Software Testing */}
                <div className="section">
                    <h4>Types of Software Testing</h4>
                    <ul>
                        <li>Manual Testing</li>
                        <li>Automation Testing</li>
                        <li>Functional Testing</li>
                        <li>Non-Functional Testing</li>
                        <li>Unit Testing</li>
                        <li>Integration Testing</li>
                        <li>System Testing</li>
                        <li>Acceptance Testing</li>
                    </ul>
                </div>

                {/* Manual vs Automation Testing */}
                <div className="section">
                    <h4>Manual vs Automation Testing</h4>
                    <p>
                        Manual testing involves human intervention to manually execute test cases without the use of automation tools. Automation testing, on the other hand, uses scripts and tools to run tests automatically, saving time and effort on repetitive tasks.
                    </p>
                </div>

                {/* Software Testing Life Cycle (STLC) */}
                <div className="section">
                    <h4>Software Testing Life Cycle (STLC)</h4>
                    <ul>
                        <li>Requirement Analysis</li>
                        <li>Test Planning</li>
                        <li>Test Case Development</li>
                        <li>Test Environment Setup</li>
                        <li>Test Execution</li>
                        <li>Test Cycle Closure</li>
                    </ul>
                </div>

                {/* Importance of Testing in SDLC */}
                <div className="section">
                    <h4>Importance of Testing in SDLC</h4>
                    <p>
                        Testing is critical in the Software Development Life Cycle (SDLC) as it helps in identifying defects early in the process, ensuring that the final product is of high quality, and meeting user expectations. It helps avoid costly errors in production.
                    </p>
                </div>

                {/* Popular Testing Tools */}
                <div className="section">
                    <h4>Popular Testing Tools</h4>
                    <ul>
                        <li>Selenium</li>
                        <li>Postman</li>
                        <li>JUnit/TestNG</li>
                        <li>Cucumber</li>
                        <li>LoadRunner</li>
                        <li>JMeter</li>
                        <li>Appium</li>
                    </ul>
                </div>

                {/* Conclusion */}
                <div className="section">
                    <h4>Conclusion</h4>
                    <p>
                        Software testing is an integral part of software development, ensuring the reliability, security, and performance of applications. By identifying and fixing defects early, it plays a crucial role in delivering high-quality products to end-users.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SoftwareTesting;
