import React from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';
import automationImg from 'C:/Users/AdityaPP/software-testing-edu/src/Automation.jpg';
import manualTestingImg from 'C:/Users/AdityaPP/software-testing-edu/src/manual-testing.webp';
import agileProcessImg from 'C:/Users/AdityaPP/software-testing-edu/src/agile-process.png';
import SecondHeader from "./SecondHeader";

const Courses = () => {
    const courses = [
        {
            id: 1,
            title: "Automation Testing",
            description: "Learn the fundamentals of Automation Testing.",
            image: automationImg, // Replace with actual image path
            detailsLink: "/courses/automation-testing",
        },
        {
            id: 2,
            title: "Manual Testing",
            description: "Understand the concepts of Manual Testing.",
            image: manualTestingImg , // Replace with actual image path
            detailsLink: "/courses/manual-testing",
        },
        {
            id: 3,
            title: "Agile Methodologies",
            description: "Dive into Agile practices and methodologies.",
            image: agileProcessImg, // Replace with actual image path
            detailsLink: "/courses/agile-methodologies",
        },
        // Add more courses as needed
    ];


    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader/>
            <h2 className="text-center mb-4">Available Courses</h2>
            <div className="row">
                {courses.map((course) => (
                    <div className="col-md-4" key={course.id}>
                        <div className="card">
                            <img src={course.image} className="card-img-top" alt={course.title} />
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">{course.description}</p>
                                <Link to={course.detailsLink} className="btn btn-primary">Learn More</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
