// src/pages/Agile.js
import React from 'react';
import SecondHeader from "./SecondHeader";

const Agile = () => {
    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader />
            <h1>Agile Methodology</h1>
            <p>
                Agile is a software development methodology that focuses on iterative development, customer collaboration,
                and flexibility. It helps teams deliver products in small increments, ensuring frequent feedback and improvements.
            </p>
            <h3>Key Principles of Agile</h3>
            <ul>
                <li>Customer satisfaction through early and continuous delivery</li>
                <li>Welcoming changing requirements</li>
                <li>Frequent delivery of working software</li>
                <li>Collaboration between business stakeholders and developers</li>
            </ul>
            <p>Agile frameworks include Scrum, Kanban, and Extreme Programming (XP).</p>
        </div>
    );
};

export default Agile;
