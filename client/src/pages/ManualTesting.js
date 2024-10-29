import React from 'react';
import SecondHeader from './SecondHeader';
import './ManualTesting.css'; // You can style this page separately

const ManualTesting = () => {
    return (
        <div className="manual-testing-page">
            {/* Include the second header here */}
            <SecondHeader />
            <div className="container">
                <h1>Manual Testing</h1>

                {/* Introduction Section */}
                <div className="section">
                    <h4>What is Manual Testing?</h4>
                    <p>
                        Manual Testing is the process of manually executing test cases without the use of automation tools. It involves testers playing the role of end-users and using the application's features to ensure correct behavior.
                    </p>
                </div>

                {/* Importance of Manual Testing */}
                <div className="section">
                    <h4>Importance of Manual Testing</h4>
                    <p>
                        Manual testing is crucial in detecting bugs that automation testing might miss. It helps ensure that the software's UI and user experience are satisfactory. Additionally, it is more flexible and adaptable when changes are made to the application.
                    </p>
                </div>

                {/* Types of Manual Testing */}
                <div className="section">
                    <h4>Types of Manual Testing</h4>
                    <ul>
                        <li>Exploratory Testing</li>
                        <li>Ad-hoc Testing</li>
                        <li>Black-box Testing</li>
                        <li>White-box Testing</li>
                        <li>User Acceptance Testing (UAT)</li>
                        <li>System Testing</li>
                    </ul>
                </div>

                {/* Manual Testing Process */}
                <div className="section">
                    <h4>Manual Testing Process</h4>
                    <ul>
                        <li>Understanding Requirements</li>
                        <li>Creating Test Plans</li>
                        <li>Writing Test Cases</li>
                        <li>Executing Test Cases</li>
                        <li>Reporting Bugs</li>
                        <li>Retesting and Regression Testing</li>
                    </ul>
                </div>

                {/* Advantages of Manual Testing */}
                <div className="section">
                    <h4>Advantages of Manual Testing</h4>
                    <ul>
                        <li>Detects issues related to the user experience (UX) and interface.</li>
                        <li>Ideal for small projects or frequently changing requirements.</li>
                        <li>Offers flexibility for the tester to explore and discover unexpected bugs.</li>
                    </ul>
                </div>

                {/* Challenges of Manual Testing */}
                <div className="section">
                    <h4>Challenges of Manual Testing</h4>
                    <ul>
                        <li>Time-consuming and labor-intensive.</li>
                        <li>Prone to human error, as it depends on the tester’s skill.</li>
                        <li>Not suitable for large-scale projects with repetitive tasks.</li>
                    </ul>
                </div>

                {/* Conclusion */}
                <div className="section">
                    <h4>Conclusion</h4>
                    <p>
                        Manual Testing plays an essential role in software quality assurance. Though automation is preferred for repetitive tasks, manual testing is irreplaceable in areas like exploratory, ad-hoc, and usability testing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManualTesting;
