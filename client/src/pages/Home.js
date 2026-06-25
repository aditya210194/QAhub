import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';
import SecondHeader from "./SecondHeader";
import CoursesData from './CoursesData';
import heroBg from '../images/heroBg.png';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState(false)

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });

        // Check if user is logged in
        const token = sessionStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

        if (token && userData) {
            setIsLoggedIn(true);
            setUser(userData);
        }
    }, []);

    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (topic) => {
        setSelectedTopic(topic);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto';
    };

    // Handle CTA button click - redirect based on login status
    const handleGetStartedClick = (e) => {
        if (isLoggedIn) {
            e.preventDefault();
            navigate('/courses');
        }
        // If not logged in, let the Link to="/register" work normally
    };

    const handleFreeTrialClick = (e) => {
        if (isLoggedIn) {
            e.preventDefault();
            navigate('/courses');
        }
    };

    // Get the top 5 most popular courses (based on rating)
    const popularCourses = useMemo(() => {
        const sorted = [...CoursesData].sort((a, b) => b.rating - a.rating);
        return sorted.slice(0, 5);
    }, []);

    const getModuleCount = (course) => {
        if (course.modules && typeof course.modules === 'object') {
            if (Array.isArray(course.modules)) {
                return `${course.modules.length} Modules`;
            }
            if (course.modules.lessons && Array.isArray(course.modules.lessons)) {
                return `${course.modules.lessons.length} Lessons`;
            }
            if (course.modules.title) {
                return '12 Modules';
            }
        }
        if (typeof course.modules === 'number') {
            return `${course.modules} Modules`;
        }
        if (typeof course.modules === 'string') {
            return course.modules;
        }
        return '12 Modules';
    };

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

    const learningTopics = [
        {
            id: 1,
            icon: "📖",
            title: "Manual Testing",
            shortDesc: "Master core testing principles and techniques",
            fullDesc: "Learn black-box and white-box testing techniques, equivalence partitioning, boundary value analysis, test case design, test execution, bug reporting, and real-world bug tracking using JIRA and Bugzilla. Master test planning, test execution, and effective communication with development teams. Manual testing remains a critical skill because human intuition and exploratory testing cannot be fully automated.",
            color: "#667eea"
        },
        {
            id: 2,
            icon: "🤖",
            title: "Automation Testing",
            shortDesc: "Build robust frameworks with modern tools",
            fullDesc: "Master Selenium WebDriver, Cypress, Playwright, Page Object Model, data-driven testing, cross-browser testing, and CI/CD integration using Jenkins and GitHub Actions. Write maintainable test scripts in Java, Python, and JavaScript. Learn to design scalable automation solutions that can run thousands of tests in minutes.",
            color: "#764ba2"
        },
        {
            id: 3,
            icon: "🔌",
            title: "API Testing",
            shortDesc: "Validate backend services thoroughly",
            fullDesc: "Learn RESTful and SOAP web services testing using Postman and REST Assured. Master JSON/XML validation, authentication handling, error scenario testing, status code validation, response time analysis, schema validation, and performance testing at the API level. These skills are in high demand as more organizations move toward microservices architectures.",
            color: "#f59e0b"
        },
        {
            id: 4,
            icon: "⚡",
            title: "Performance & Security",
            shortDesc: "Identify bottlenecks and vulnerabilities",
            fullDesc: "Use JMeter and LoadRunner for performance testing. Simulate thousands of concurrent users, analyze performance metrics like response time and throughput, identify memory leaks and database inefficiencies. Master OWASP Top 10 vulnerabilities including SQL injection, XSS, and authentication flaws using OWASP ZAP and Burp Suite.",
            color: "#ef4444"
        }
    ];

    return (
        <div className="home">
            <Helmet>
                <title>QA Hub - Software Testing Education & Courses</title>
                <meta name="description" content="Learn software testing with QA Hub. Explore courses on manual testing, automation, API testing, and more. Start your QA career today." />
                <meta property="og:title" content="QA Hub - Software Testing Education" />
                <meta property="og:description" content="Learn software testing with QA Hub. Courses on manual, automation, and API testing." />
                <meta property="og:url" content="https://www.qahub.co.in" />
                <meta property="og:type" content="website" />
            </Helmet>
            <h1 style={{ display: 'none' }}>QA Hub - Software Testing Education Platform</h1>
            <SecondHeader />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-bg-image" style={{ backgroundImage: `url(${heroBg})` }}></div>
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
                                {/* Show Free Trial/Get Started based on login status */}
                                {!isLoggedIn ? (
                                    <Link to="/register" className="btn btn-outline-light btn-lg">
                                        Free Trial
                                    </Link>
                                ) : (
                                    <Link
                                        to="/courses"
                                        className="btn btn-outline-light btn-lg"
                                        onClick={handleFreeTrialClick}
                                    >
                                        Continue Learning
                                    </Link>
                                )}
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
                                            <p>Courses designed with input from QA leaders at top tech companies</p>
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

            {/* What You'll Learn - Icon Cards with Modal */}
            <section className="topics-section py-5">
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2 className="section-title">What You'll Learn at QA Hub</h2>
                        <p className="section-subtitle">Comprehensive curriculum designed by industry experts</p>
                    </div>
                    <div className="row">
                        {learningTopics.map((topic, index) => (
                            <div className="col-lg-3 col-md-6 mb-4" key={topic.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div
                                    className="topic-card"
                                    onClick={() => openModal(topic)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="topic-icon-wrapper" style={{ background: `${topic.color}15` }}>
                                        <span className="topic-icon">{topic.icon}</span>
                                    </div>
                                    <h3 className="topic-title">{topic.title}</h3>
                                    <p className="topic-short-desc">{topic.shortDesc}</p>
                                    <span className="read-more">Learn More →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {showModal && selectedTopic && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <div className="modal-header">
                            <span className="modal-icon">{selectedTopic.icon}</span>
                            <h2>{selectedTopic.title}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{selectedTopic.fullDesc}</p>
                        </div>
                    </div>
                </div>
            )}

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
                                        <img src={course.image} loading="lazy" className="card-img-top" alt={course.title} />
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
                                            <span className="meta-item">📚 {getModuleCount(course)}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <Link to={`/course/${course.id}`} className="btn btn-primary w-100">
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
                                        <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
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

            {/* SEO Content Section - Visible text for crawlers */}
            <section className="seo-content-section py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="seo-text" style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
                                <p>
                                    QA Hub is India's leading software testing education platform, offering comprehensive courses
                                    in manual testing, automation testing, API testing, performance testing, and security testing.
                                    With over 10,000+ students trained and a 98% satisfaction rate, we are committed to helping
                                    QA professionals advance their careers. Our industry-driven curriculum, hands-on learning
                                    approach, and expert instructors ensure you gain practical skills that employers value.
                                    Whether you're a beginner starting your journey or an experienced tester looking to upskill,
                                    QA Hub provides the resources, community support, and career guidance you need to succeed
                                    in the competitive world of software quality assurance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Show different CTA based on login status */}
            <section className="cta-section py-5">
                <div className="container">
                    <div className="cta-card text-center" data-aos="zoom-in">
                        <h2 className="cta-title">
                            {isLoggedIn ? 'Continue Your Learning Journey' : 'Start Your QA Journey Today'}
                        </h2>
                        <p className="cta-subtitle">
                            {isLoggedIn
                                ? 'Access your courses and continue mastering QA skills'
                                : 'Join our community of 10,000+ QA professionals'}
                        </p>
                        <div className="cta-buttons">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/register" className="btn btn-light btn-lg">
                                        Get Started for Free
                                    </Link>
                                    <Link to="/courses" className="btn btn-outline-light btn-lg">
                                        Browse Courses
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/courses" className="btn btn-light btn-lg" onClick={handleGetStartedClick}>
                                        Continue Learning
                                    </Link>
                                    <Link to="/community-features" className="btn btn-outline-light btn-lg">
                                        Join Community
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;