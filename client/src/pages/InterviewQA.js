import React from 'react';
import SecondHeader from './SecondHeader';
import './InterviewQA.css'; // Add styling in this CSS file if needed

const InterviewQA = () => {
    return (
        <div className="interview-qa-page">
            {/* Include the second header here */}
            <SecondHeader />
            <div className="container">
                <h1>Interview Q&A for Software Testing</h1>

                {/* Introduction to the section */}
                <div className="section">
                    <h4>Overview</h4>
                    <p>
                        Preparing for a software testing interview? Here are some commonly asked interview questions and answers that will help you succeed in your interview.
                    </p>
                </div>

                {/* Section: Manual Testing Questions */}
                <div className="section">
                    <h4>Manual Testing Interview Questions</h4>
                    <ul>
                        <li>
                            <strong>Q1: What is the difference between verification and validation?</strong>
                            <p><strong>Answer:</strong> Verification ensures the product is built according to requirements, while validation checks if the product meets user expectations.</p>
                        </li>
                        <li>
                            <strong>Q2: What are the different levels of testing?</strong>
                            <p><strong>Answer:</strong> The different levels of testing include Unit Testing, Integration Testing, System Testing, and Acceptance Testing.</p>
                        </li>
                        <li>
                            <strong>Q3: What is a Test Case?</strong>
                            <p><strong>Answer:</strong> A Test Case is a document that outlines the test steps, prerequisites, inputs, and expected results for a particular test scenario.</p>
                        </li>
                    </ul>
                </div>

                {/* Section: Automation Testing Questions */}
                <div className="section">
                    <h4>Automation Testing Interview Questions</h4>
                    <ul>
                        <li>
                            <strong>Q1: What is Selenium, and what are its components?</strong>
                            <p><strong>Answer:</strong> Selenium is an open-source tool for automating web browsers. Its
                                components include Selenium IDE, Selenium WebDriver, Selenium Grid, and Selenium RC.</p>
                        </li>
                        <li>
                            <strong>Q2: How do you identify elements in Selenium?</strong>
                            <p><strong>Answer:</strong> Elements in Selenium can be identified using locators such as
                                ID, Name, XPath, CSS Selector, Link Text, and Tag Name.</p>
                        </li>
                        <li>
                            <strong>Q3: What are the benefits of automated testing?</strong>
                            <p><strong>Answer:</strong> Automated testing helps in faster execution of repetitive tasks,
                                improves accuracy, saves time and resources, and supports continuous integration.</p>
                        </li>
                        <li>
                            <strong>Q: What are the benefits of automation testing?</strong>
                            <p>A: Automation testing saves time, improves accuracy, increases test coverage, and allows
                                for executing tests across different environments.</p>
                        </li>
                        <li>
                            <strong>Q: What is Selenium?</strong>
                            <p>A: Selenium is an open-source tool used for automating web browsers. It supports multiple
                                programming languages, including Java, Python, and JavaScript.</p>
                        </li>
                        <li>
                            <strong>Q: What is the difference between Selenium WebDriver and Selenium IDE?</strong>
                            <p>A: Selenium WebDriver allows for cross-browser testing by writing test scripts, whereas
                                Selenium IDE is a simpler, record-and-playback tool.</p>
                        </li>
                    </ul>
                </div>

                {/* Section: Agile Methodology Questions */}
                <div className="section">
                    <h4>Agile Methodology Interview Questions</h4>
                    <ul>
                        <li>
                            <strong>Q1: What is Agile, and how is it different from traditional software development
                                methodologies?</strong>
                            <p><strong>Answer:</strong> Agile is an iterative software development methodology that
                                emphasizes collaboration, customer feedback, and small, rapid releases. It differs from
                                traditional models, like Waterfall, by being more flexible and adaptive to change.</p>
                        </li>
                        <li>
                            <strong>Q2: What is a Scrum Master?</strong>
                            <p><strong>Answer:</strong> A Scrum Master is a facilitator for an Agile development team,
                                ensuring that the team follows Agile principles and practices. The Scrum Master also
                                helps remove obstacles to the team's progress.</p>
                        </li>
                        <li>
                            <strong>Q: What is a sprint in Scrum?</strong>
                            <p>A: A sprint is a time-boxed period, typically 2-4 weeks, during which a Scrum team works
                                to complete a set of tasks from the product backlog.</p>
                        </li>
                        <li>
                            <strong>Q: What are the key roles in Scrum?</strong>
                            <p>A: Product Owner, Scrum Master, and Development Team.</p>
                        </li>
                    </ul>
                </div>

                {/* Section for General Q&A */}
                <div className="section">
                    <h4>General Interview Questions</h4>
                    <ul>
                        <li>
                            <strong>Q: How do you prioritize testing tasks?</strong>
                            <p>A: Prioritize based on the risk, impact, and probability of defects, focusing on critical features first.</p>
                        </li>
                        <li>
                            <strong>Q: What are some common challenges faced in software testing?</strong>
                            <p>A: Common challenges include incomplete requirements, tight deadlines, communication gaps, and limited resources for testing.</p>
                        </li>
                        <li>
                            <strong>Q: What is the role of a QA in an Agile environment?</strong>
                            <p>A: In an Agile environment, QA is integrated into the development process, working closely with developers and stakeholders to ensure continuous testing and feedback.</p>
                        </li>
                    </ul>
                </div>


                {/* Section: Miscellaneous Questions */}
                <div className="section">
                    <h4>Other Frequently Asked Questions</h4>
                    <ul>
                        <li>
                            <strong>Q1: What is the difference between white-box testing and black-box testing?</strong>
                            <p><strong>Answer:</strong> White-box testing involves testing internal structures or workings of an application, while black-box testing involves testing the application's functionality without knowledge of the internal code.</p>
                        </li>
                        <li>
                            <strong>Q2: What is regression testing?</strong>
                            <p><strong>Answer:</strong> Regression testing is performed to verify that recent code changes haven't adversely affected existing features in the software.</p>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default InterviewQA;
