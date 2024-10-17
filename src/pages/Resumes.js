// src/pages/Resumes.js
import React from 'react';
import SecondHeader from "./SecondHeader";

const Resumes = () => {
    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader />
            <h1>Software Testing Resumes</h1>
            <p>
                Creating a resume that stands out is crucial for landing your desired job in the software testing field.
                Here are some tips for building an effective resume:
            </p>
            <h3>Key Sections to Include</h3>
            <ul>
                <li>Contact Information</li>
                <li>Professional Summary</li>
                <li>Skills (both manual and automation testing)</li>
                <li>Relevant Experience</li>
                <li>Certifications</li>
                <li>Projects worked on</li>
            </ul>
            <p>Include key tools such as Selenium, JIRA, and Postman, and emphasize your understanding of testing methodologies like Agile.</p>
        </div>
    );
};

export default Resumes;
