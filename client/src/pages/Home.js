import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';
import SecondHeader from "./SecondHeader";
import automationImg from '../images/Automation.jpg';
import manualTestingImg from '../images/manual-testing.webp';
import agileProcessImg from '../images/agile-process.png';
import ApiTestingImg from '../images/ApiTestingImg.jpg';
import PerformanceImg from '../images/Performance.jpg';

const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    const popularCourses = [
        {
            id: 1,
            title: 'Automation Testing',
            description: 'Master Selenium, Cypress, and Playwright for robust test automation solutions',
            link: '/course/automation-testing',
            image: automationImg,
            duration: '4 weeks',
            level: 'Intermediate',
            rating: 4.8
        },
        {
            id: 2,
            title: 'Manual Testing',
            description: 'Learn comprehensive manual testing techniques and test case design',
            link: '/course/manual-testing',
            image: manualTestingImg,
            duration: '6 weeks',
            level: 'Beginner',
            rating: 4.6
        },
        {
            id: 3,
            title: 'Agile Methodologies',
            description: 'Implement Agile testing practices in Scrum and Kanban environments',
            link: '/course/agile-methodologies',
            image: agileProcessImg,
            duration: '3 weeks',
            level: 'Intermediate',
            rating: 4.7
        },
        {
            id: 4,
            title: 'Performance Testing',
            description: 'Master JMeter and LoadRunner for application performance validation',
            link: '/course/performance-testing',
            image: PerformanceImg,
            duration: '5 weeks',
            level: 'Advanced',
            rating: 4.9
        },
        {
            id: 5,
            title: 'API Testing',
            description: "Expert-level API testing with Postman, REST Assured, and SoapUI",
            link: '/course/api-testing',
            image: ApiTestingImg,
            duration: '4 weeks',
            level: 'Intermediate',
            rating: 4.8
        },
    ];

    const testimonials = [
        {
            id: 1,
            text: "QA Hub helped me transition from manual to automation testing. Landed a 40% salary increase within 3 months!",
            name: "John Doe",
            position: "Senior QA Engineer",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            text: "The automation testing course was exceptional! I learned practical skills that I applied immediately at work.",
            name: "Jane Smith",
            position: "QA Lead",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 3,
            text: "The Agile course transformed how my team works. Our defect escape rate dropped by 65% after implementation.",
            name: "Michael Johnson",
            position: "QA Manager",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
    ];

    const stats = [
        { value: "10,000+", label: "Students Trained" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "500+", label: "Hours of Content" },
        { value: "50+", label: "Expert Instructors" }
    ];

    return (
        <div className="home">
            <SecondHeader />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <div className="row">
                        <div className="col-lg-7">
                            <h1 className="hero-title" data-aos="fade-right">
                                Master Software Testing with Industry Experts
                            </h1>
                            <p className="hero-subtitle" data-aos="fade-right" data-aos-delay="100">
                                Advance your career with our comprehensive courses in automation, manual,
                                performance, and API testing
                            </p>
                            <div className="hero-buttons" data-aos="fade-right" data-aos-delay="200">
                                <Link to="/courses" className="btn btn-primary btn-lg">
                                    Explore Courses
                                </Link>
                                <Link to="/register" className="btn btn-outline-light btn-lg">
                                    Free Trial
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section py-5">
                <div className="container">
                    <div className="row">
                        {stats.map((stat, index) => (
                            <div className="col-md-3 col-6 mb-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="stat-card text-center">
                                    <h3 className="stat-value">{stat.value}</h3>
                                    <p className="stat-label">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="value-section py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
                            <div className="value-card">
                                <h2 className="section-title">Why Choose QA Hub?</h2>
                                <ul className="value-list">
                                    <li>
                                        <div className="value-icon">✓</div>
                                        <div>
                                            <h4>Industry-Driven Curriculum</h4>
                                            <p>Courses designed with input from QA leaders at Google, Amazon, and Microsoft</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="value-icon">✓</div>
                                        <div>
                                            <h4>Hands-On Learning</h4>
                                            <p>Real-world projects and labs using current industry tools</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="value-icon">✓</div>
                                        <div>
                                            <h4>Career Support</h4>
                                            <p>Resume reviews, mock interviews, and job placement assistance</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="value-icon">✓</div>
                                        <div>
                                            <h4>Flexible Learning</h4>
                                            <p>Self-paced courses with live mentoring sessions</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                            <div className="value-image-container">
                                <div className="value-image-card">
                                    <div className="image-placeholder">
                                        <div className="overlay-box overlay-1">
                                            <h5>Certified Instructors</h5>
                                            <p>ISTQB, Agile, DevOps certified</p>
                                        </div>
                                        <div className="overlay-box overlay-2">
                                            <h5>Latest Tools</h5>
                                            <p>Selenium, Cypress, Postman, JIRA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="courses-section py-5">
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2 className="section-title">Popular Courses</h2>
                        <p className="section-subtitle">Join thousands of students mastering QA skills</p>
                    </div>
                    <div className="row">
                        {popularCourses.map((course) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={course.id} data-aos="fade-up">
                                <div className="card course-card h-100">
                                    <div className="card-img-top-container">
                                        <img src={course.image} className="card-img-top" alt={course.title}/>
                                        <div className="card-badge">{course.level}</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title">{course.title}</h5>
                                            <div className="course-rating">
                                                <span className="rating-value">{course.rating}</span>
                                                <span className="rating-star">★</span>
                                            </div>
                                        </div>
                                        <p className="card-text">{course.description}</p>
                                        <div className="course-meta">
                                            <span className="meta-item">⏱️ {course.duration}</span>
                                            <span className="meta-item">📚 12 Modules</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <Link to={course.link} className="btn btn-primary w-100">
                                            Explore Course
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4" data-aos="fade-up">
                        <Link to="/courses" className="btn btn-outline-primary btn-lg">
                            View All Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section py-5">
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2 className="section-title">Success Stories</h2>
                        <p className="section-subtitle">Hear from our students and alumni</p>
                    </div>
                    <div className="row">
                        {testimonials.map((testimonial) => (
                            <div className="col-md-4 mb-4" key={testimonial.id} data-aos="fade-up">
                                <div className="testimonial-card">
                                    <div className="testimonial-content">
                                        <div className="quote-icon">❝</div>
                                        <p className="testimonial-text">"{testimonial.text}"</p>
                                    </div>
                                    <div className="testimonial-author">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar"/>
                                        <div>
                                            <h5 className="author-name">{testimonial.name}</h5>
                                            <p className="author-position">{testimonial.position}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <div className="container">
                    <div className="cta-card text-center" data-aos="zoom-in">
                        <h2 className="cta-title">Start Your QA Journey Today</h2>
                        <p className="cta-subtitle">Join our community of 10,000+ QA professionals</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-light btn-lg">
                                Get Started for Free
                            </Link>
                            <Link to="/courses" className="btn btn-outline-light btn-lg">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;