import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css'; // Make sure to import your CSS file
import SecondHeader from './SecondHeader'; // Adjust the path as needed
import automationImg from 'C:/Users/AdityaPP/software-testing-edu/client/src/Automation.jpg';
import manualTestingImg from 'C:/Users/AdityaPP/software-testing-edu/client/src/manual-testing.webp';
import agileProcessImg from 'C:/Users/AdityaPP/software-testing-edu/client/src/agile-process.png';



const Home = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const popularCourses = [
        {
            id: 1,
            title: 'Automation Testing',
            description: 'Learn the basics of automation testing with practical examples.',
            link: '/courses/automation-testing',
            image: automationImg, // Update with actual path
            duration: '4 weeks',
            level: 'Intermediate',
            price: '₹199',
        },
        {
            id: 2,
            title: 'Manual Testing',
            description: 'Understand the fundamentals of manual testing.',
            link: '/courses/manual-testing',
            image: manualTestingImg, // Update with actual path
            duration: '6 weeks',
            level: 'Beginner',
            price: '₹149',
        },
        {
            id: 3,
            title: 'Agile Methodologies',
            description: 'Explore Agile methodologies and their impact on software testing.',
            link: '/courses/agile-methodologies',
            image: agileProcessImg, // Update with actual path
            duration: '3 weeks',
            level: 'Intermediate',
            price: '₹179',
        },
        // Add more courses as needed
    ];

    const testimonials = [
        {
            id: 1,
            text: "EduAdda helped me gain a solid foundation in software testing. The courses are well-structured and informative.",
            name: "John Doe",
            position: "Software Tester",
        },
        {
            id: 2,
            text: "The automation testing course was excellent! I learned practical skills that I could apply immediately.",
            name: "Jane Smith",
            position: "QA Engineer",
        },
        {
            id: 3,
            text: "I love the Agile methodologies course! It really opened my eyes to the benefits of Agile in software development.",
            name: "Michael Johnson",
            position: "Project Manager",
        },
        // Add more testimonials as needed
    ];

    return (
        <div className="home">
            {/* Include the second header here */}
            <SecondHeader/>

            <header className="hero-section text-center py-5">
                <div className="container">
                    <h1 className="display-4 font-weight-bold mt-3">Welcome to EduAdda</h1>
                    <p className="lead">Your gateway to mastering Software Testing</p>
                    <Link to="/courses" className="btn btn-primary btn-lg mt-4">
                        Explore Courses
                    </Link>
                </div>
            </header>

            {/* Additional Text Section */}
            <section className="intro-section py-5">
                <div className="container text-center">
                    <h2 className="mb-4">Why Choose EduAdda?</h2>
                    <p className="lead">
                        At EduAdda, we are dedicated to providing top-notch education in software testing.
                        Our courses are designed for everyone, from beginners looking to start their careers
                        to experienced professionals aiming to sharpen their skills.
                    </p>
                    <p>
                        Software testing is a crucial part of the software development process. It ensures that
                        applications function correctly, meet user requirements, and are free of defects.
                        With the increasing complexity of software systems, the demand for skilled testers is
                        greater than ever.
                    </p>
                    <p>
                        Our platform offers a comprehensive curriculum that covers a wide range of topics,
                        including Manual Testing, Automation Testing, Agile Methodologies, and Interview Preparation.
                        Each course is crafted by industry experts to equip you with the knowledge and skills needed
                        to excel in this dynamic field.
                    </p>
                    <p>
                        Join our community of learners and take your first step toward mastering software testing today!
                    </p>
                </div>
            </section>

            <section className="courses-section py-5">
                <div className="container">
                    <h2 className="text-center mb-4">Popular Courses</h2>
                    <div className="row">
                        {popularCourses.map((course) => (
                            <div className="col-md-4 mb-4" key={course.id} data-aos="fade-up">
                                <div className="card shadow-sm border-light">
                                    <img src={course.image} className="card-img-top" alt={course.title}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{course.title}</h5>
                                        <p className="card-text">{course.description}</p>
                                        <p className="card-text"><strong>Duration:</strong> {course.duration}</p>
                                        <p className="card-text"><strong>Level:</strong> {course.level}</p>
                                        <p className="card-text"><strong>Price:</strong> {course.price}</p>
                                        <Link to={course.link} className="btn btn-primary">
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="testimonials-section py-5">
                <div className="container">
                    <h2 className="text-center mb-4">What Our Users Say</h2>
                    <div className="row">
                        {testimonials.map((testimonial, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="testimonial-card p-4 shadow rounded">
                                    <p className="testimonial-feedback">"{testimonial.text}"</p>
                                    <h5 className="testimonial-name">{testimonial.name}</h5>
                                    <small className="text-muted">{testimonial.position}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
