// src/pages/InterviewQA.js
import React from 'react';
import SecondHeader from "./SecondHeader";

const InterviewQA = () => {
    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader />
            <h1>Interview Q&A for Software Testing</h1>
            <p>
                Preparing for a software testing interview? Here are some common questions you may encounter:
            </p>
            <h3>Common Questions</h3>
            <ul>
                <li>What is the difference between manual and automation testing?</li>
                <li>Can you explain the STLC (Software Testing Life Cycle)?</li>
                <li>What are the various types of testing?</li>
                <li>What is regression testing and when do you perform it?</li>
                <li>How do you handle bug reporting?</li>
            </ul>
            <p>Be ready to answer scenario-based questions that test your analytical skills.</p>
        </div>
    );
};

export default InterviewQA;
