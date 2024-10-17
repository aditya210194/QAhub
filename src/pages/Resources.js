import React from 'react';
import './Resources.css';
import SecondHeader from "./SecondHeader";

const resources = [
    {
        title: "Selenium Documentation",
        description: "Official documentation for Selenium, including tutorials and API references.",
        link: "https://www.selenium.dev/documentation/",
    },
    {
        title: "Postman API Testing Guide",
        description: "Comprehensive guide on using Postman for API testing.",
        link: "https://learning.postman.com/docs/getting-started/introduction/",
    },
    {
        title: "Agile Testing Quadrants",
        description: "An insightful article on Agile Testing Quadrants and their application in software testing.",
        link: "https://www.agilealliance.org/glossary/testing-quadrants/",
    },
    {
        title: "Software Testing Help",
        description: "A resourceful site that provides software testing tutorials, tools, and reviews.",
        link: "https://www.softwaretestinghelp.com/",
    },
];

const Resources = () => {
    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader/>
            <h2 className="text-center mb-4">Resources</h2>
            <div className="row">
                {resources.map((resource, index) => (
                    <div className="col-md-6 mb-4" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{resource.title}</h5>
                                <p className="card-text">{resource.description}</p>
                                <a href={resource.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Learn More</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;
