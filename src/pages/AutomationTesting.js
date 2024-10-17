// src/pages/AutomationTesting.js
import React from 'react';
import SecondHeader from './SecondHeader';
import './AutomationTesting.css'; // Optional: CSS file for additional styling
import GraphROI from 'C:/Users/AdityaPP/software-testing-edu/src/roi-en.png'
import AutomationPro from 'C:/Users/AdityaPP/software-testing-edu/src/Automation.jpg'

const AutomationTesting = () => {
    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader />
            <h1>Automation Testing</h1>
            <p>
                Automation testing is a software testing technique that uses automated tools to execute tests, compare actual outcomes with predicted outcomes, and report results. It enhances the efficiency and effectiveness of the testing process, ensuring better quality software and faster releases.
            </p>

            <h3>Benefits of Automation Testing</h3>
            <ul>
                <li>Increased Test Coverage</li>
                <li>Faster Execution</li>
                <li>Consistent Results</li>
                <li>Reduced Human Error</li>
                <li>Reusability of Test Scripts</li>
            </ul>

            <h3>Automation Testing Tools</h3>
            <p>Some of the most popular automation testing tools include:</p>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Tool</th>
                    <th>Purpose</th>
                    <th>Best For</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Selenium</td>
                    <td>Web application testing</td>
                    <td>Browser-based applications</td>
                </tr>
                <tr>
                    <td>JMeter</td>
                    <td>Performance testing</td>
                    <td>Load testing and performance metrics</td>
                </tr>
                <tr>
                    <td>Postman</td>
                    <td>API testing</td>
                    <td>RESTful APIs</td>
                </tr>
                <tr>
                    <td>TestNG</td>
                    <td>Test management</td>
                    <td>Java applications</td>
                </tr>
                </tbody>
            </table>

            <h3>Key Concepts in Automation Testing</h3>
            <p>Understanding the following concepts is crucial for effective automation testing:</p>
            <ul>
                <li><strong>Test Automation Frameworks:</strong> These provide a structured environment for automation testing, such as Keyword-Driven, Data-Driven, and Behavior-Driven frameworks.</li>
                <li><strong>Continuous Integration/Continuous Deployment (CI/CD):</strong> Automation testing plays a vital role in CI/CD pipelines, allowing for rapid and reliable deployments.</li>
                <li><strong>Version Control:</strong> Using tools like Git for managing test scripts and collaborating with team members is essential.</li>
            </ul>

            <h3>Automation Testing Process</h3>
            <img src={AutomationPro} alt="Automation Testing Process" className="img-fluid my-4" />
            <p>This flowchart illustrates the automation testing process, which includes:</p>
            <ol>
                <li>Test Planning</li>
                <li>Test Design</li>
                <li>Test Development</li>
                <li>Test Execution</li>
                <li>Test Reporting</li>
            </ol>

            <h3>Graph: Test Automation ROI</h3>
            <img src={GraphROI} alt="Automation Testing ROI" className="img-fluid my-4" />
            <p>This graph shows the return on investment (ROI) from implementing automation testing over time.</p>

            <h3>Conclusion</h3>
            <p>
                Automation testing is essential for modern software development. By investing in automation, teams can improve their testing efficiency, increase software quality, and ultimately deliver better products faster. It’s crucial to choose the right tools and frameworks based on project needs and team skills.
            </p>
        </div>
    );
};

export default AutomationTesting;
