import React from 'react';
import './AboutUs.css';
import SecondHeader from "./SecondHeader";

const AboutUs = () => {
    return (
        <div className="about-us">
            {/* Include the second header here */}
            <SecondHeader/>
            <div className="container">
                <h2 className="text-center mb-4">About EduAdda</h2>
                <div className="row">
                    <div className="col-md-6">
                        <h4>Platform Introduction</h4>
                        <p>
                            EduAdda is dedicated to providing a comprehensive platform for individuals interested in learning software testing. Our goal is to empower learners with the knowledge and skills needed to excel in the software testing industry.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <h4>Mission Statement</h4>
                        <p>
                            Our mission is to provide accessible and quality learning resources for individuals at various levels, from beginners to experienced professionals, ensuring that everyone has the opportunity to advance their careers in software testing.
                        </p>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <h4>Topics Overview</h4>
                        <ul>
                            <li>Automation Testing</li>
                            <li>Manual Testing</li>
                            <li>Agile Methodologies</li>
                            <li>Interview Preparation</li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h4>Commitment to Excellence</h4>
                        <p>
                            Our content is continually updated by industry experts to keep pace with the latest trends and tools in software testing, ensuring that learners receive the most relevant and practical knowledge available.
                        </p>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-12">
                        <h4>Encouraging Growth</h4>
                        <p>
                            We encourage our users to leverage our platform for continuous learning and career growth, helping them achieve their professional goals in the ever-evolving field of software testing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
