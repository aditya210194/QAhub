import React from 'react';
import SecondHeader from './SecondHeader';
import './agile.css'; // Add styling in this CSS file if needed

const Agile = () => {
    return (
        <div className="agile-page">
            {/* Include the second header here */}
            <SecondHeader />
            <div className="container">
                <h1>Agile Methodology</h1>

                {/* Introduction to Agile */}
                <div className="section">
                    <h4>What is Agile?</h4>
                    <p>
                        Agile is a software development methodology that emphasizes iterative development, collaboration, and flexibility. It focuses on delivering working software quickly and continuously improving through feedback and adaptation.
                    </p>
                </div>

                {/* Agile Principles */}
                <div className="section">
                    <h4>Core Principles of Agile</h4>
                    <ul>
                        <li>Individuals and interactions over processes and tools</li>
                        <li>Working software over comprehensive documentation</li>
                        <li>Customer collaboration over contract negotiation</li>
                        <li>Responding to change over following a plan</li>
                    </ul>
                </div>

                {/* Agile Methodologies */}
                <div className="section">
                    <h4>Popular Agile Methodologies</h4>
                    <ul>
                        <li>Scrum: Focuses on time-boxed sprints and roles like Scrum Master and Product Owner.</li>
                        <li>Kanban: Visualizes workflow using a Kanban board to manage work in progress (WIP).</li>
                        <li>Extreme Programming (XP): Emphasizes technical practices like Test-Driven Development (TDD).</li>
                        <li>Lean: Focuses on minimizing waste and delivering value to the customer.</li>
                    </ul>
                </div>

                {/* Benefits of Agile */}
                <div className="section">
                    <h4>Benefits of Agile</h4>
                    <ul>
                        <li>Faster delivery of features with shorter development cycles (sprints).</li>
                        <li>Better adaptability to changing requirements and market needs.</li>
                        <li>Continuous collaboration between developers and stakeholders.</li>
                        <li>Improved product quality through iterative testing and feedback loops.</li>
                    </ul>
                </div>

                {/* Agile Roles */}
                <div className="section">
                    <h4>Key Roles in Agile</h4>
                    <ul>
                        <li>Product Owner: Represents the stakeholders and prioritizes the product backlog.</li>
                        <li>Scrum Master: Facilitates the Agile process and removes roadblocks for the team.</li>
                        <li>Development Team: Responsible for delivering working increments of the product.</li>
                    </ul>
                </div>

                {/* Challenges in Agile */}
                <div className="section">
                    <h4>Challenges of Agile</h4>
                    <ul>
                        <li>Requires high involvement and collaboration from stakeholders.</li>
                        <li>Can be difficult to scale for large or complex projects.</li>
                        <li>Frequent changes may result in scope creep if not managed properly.</li>
                    </ul>
                </div>

                {/* Conclusion */}
                <div className="section">
                    <h4>Conclusion</h4>
                    <p>
                        Agile has revolutionized software development by providing a flexible, iterative approach that allows teams to deliver high-quality software faster. Its focus on collaboration, customer satisfaction, and adaptability makes it a popular choice for modern development teams.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Agile;
