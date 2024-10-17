import React from 'react';
import SecondHeader from "./SecondHeader";

const Articles = () => {
    // Sample article data
    const articles = [
        {
            title: "Understanding Automation Testing",
            description: "A deep dive into automation testing methodologies, tools, and best practices.",
            link: "https://example.com/automation-testing",
        },
        {
            title: "Getting Started with Manual Testing",
            description: "Learn the basics of manual testing and how to get started with your first project.",
            link: "https://example.com/manual-testing",
        },
        {
            title: "Agile Methodologies in Software Testing",
            description: "Explore the role of Agile methodologies in modern software testing processes.",
            link: "https://example.com/agile-testing",
        },
        {
            title: "Interview Preparation for QA Roles",
            description: "Tips and strategies to prepare for interviews in the software testing field.",
            link: "https://example.com/interview-prep",
        },
    ];

    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader/>
            <h2 className="text-center mb-4">Articles</h2>
            <div className="row">
                {articles.map((article, index) => (
                    <div className="col-md-6 mb-4" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">{article.description}</p>
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;
