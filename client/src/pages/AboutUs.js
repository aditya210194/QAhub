import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye,
    faLightbulb,
    faUsers,
    faBookOpen,
    faChartLine,
    faCheckCircle,
    faHandshake
} from '@fortawesome/free-solid-svg-icons';
import 'aos/dist/aos.css';
import AOS from 'aos';
import './AboutUs.css';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    return (
        <div className="about-us">
            <Helmet>
                <title>About Us | QA Hub</title>
                <meta name="description" content="Learn about QA Hub — our mission to make software testing education accessible, practical, and career-focused for every learner." />
                <meta property="og:title" content="About Us | QA Hub" />
                <meta property="og:description" content="Our mission to make software testing education accessible for everyone." />
                <meta property="og:url" content="https://www.qahub.co.in/about" />
            </Helmet>
            {/* Hero Section */}
            <div className="about-hero" data-aos="fade">
                <div className="container">
                    <h1 className="hero-title" data-aos="fade-up">
                        About <span className="highlight">QA Hub</span>
                    </h1>
                    <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
                        Empowering the next generation of software testing professionals
                    </p>
                </div>
            </div>

            {/* Our Story Section - NEW for AdSense depth */}
            <div className="container">
                <div className="story-section" data-aos="fade-up">
                    <div className="container">
                        <div className="section-header">
                            <h2>Who We Are</h2>
                            <div className="divider"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="story-content">
                                    <p>
                                        QA Hub was founded with a simple yet powerful mission: to make quality software testing
                                        education accessible, practical, and career-focused. As experienced QA professionals
                                        ourselves, we saw a gap between traditional testing courses and what the industry actually
                                        demands from testing professionals today.
                                    </p>
                                    <p>
                                        Our team consists of certified testing professionals with years of hands-on experience in
                                        various domains including e-commerce, fintech, healthcare, and enterprise software. We have
                                        successfully delivered testing solutions for clients across India and internationally, giving
                                        us deep insights into what employers truly value in QA professionals.
                                    </p>
                                    <p>
                                        What makes QA Hub different is our practical, project-based approach. We don't just teach
                                        theory – we simulate real testing scenarios, share actual bug reports from production
                                        systems, and provide hands-on assignments that mirror what you'll face in your daily work
                                        as a tester. Our courses are continuously updated to reflect the latest tools, frameworks,
                                        and best practices in the rapidly evolving QA landscape.
                                    </p>
                                    <p>
                                        Today, QA Hub serves thousands of learners across India and around the world. Our community
                                        includes fresh graduates starting their careers, manual testers transitioning to automation,
                                        and experienced professionals looking to stay current with modern testing methodologies.
                                        We're proud to have helped numerous students achieve certifications, land better jobs, and
                                        advance their careers in quality assurance.
                                    </p>
                                    <p>
                                        We are headquartered in Haryana, India, and our team is committed to providing the highest
                                        quality learning experience. Every course, every resource, and every interaction is guided
                                        by our core values: quality, integrity, and student success.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="mission-section" data-aos="fade-up">
                    <div className="row align-items-center">
                        <div className="col-lg-6" data-aos="fade-right">
                            <div className="mission-card">
                                <div className="icon-wrapper">
                                    <FontAwesomeIcon icon={faBullseye} className="mission-icon" />
                                </div>
                                <h2>Our Mission</h2>
                                <p>
                                    To democratize software testing education by providing accessible, high-quality resources
                                    that equip learners at all levels with the skills needed to excel in today's competitive
                                    tech landscape.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                            <div className="vision-card">
                                <div className="icon-wrapper">
                                    <FontAwesomeIcon icon={faLightbulb} className="vision-icon" />
                                </div>
                                <h2>Our Vision</h2>
                                <p>
                                    To become the premier global platform for software testing education, fostering a
                                    community where knowledge sharing and continuous learning drive professional
                                    excellence and innovation in quality assurance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Introduction */}
                <div className="platform-section" data-aos="fade-up">
                    <div className="section-header">
                        <h2>About Our Platform</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6" data-aos="fade-right">
                            <div className="platform-card">
                                <h3><FontAwesomeIcon icon={faBookOpen} className="feature-icon" /> Comprehensive Learning</h3>
                                <p>
                                    QA Hub offers a structured learning path covering all aspects of software testing,
                                    from fundamental concepts to advanced automation techniques. Our curriculum is
                                    designed by industry experts to ensure relevance and practical applicability.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6" data-aos="fade-left">
                            <div className="platform-card">
                                <h3><FontAwesomeIcon icon={faUsers} className="feature-icon" /> Community Driven</h3>
                                <p>
                                    We believe in the power of community. Our platform connects learners with mentors
                                    and peers, facilitating knowledge exchange, collaboration, and networking
                                    opportunities within the testing community.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="features-section" data-aos="fade-up">
                    <div className="section-header">
                        <h2>Why Choose QA Hub?</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="row">
                        <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <h4>Expert-Curated Content</h4>
                                <p>
                                    All materials are vetted and regularly updated by industry professionals to ensure
                                    accuracy and relevance to current industry standards.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                <h4>Career-Focused Learning</h4>
                                <p>
                                    Our resources include practical exercises and real-world scenarios to prepare you
                                    for actual job requirements and interviews.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <FontAwesomeIcon icon={faHandshake} />
                                </div>
                                <h4>Community Support</h4>
                                <p>
                                    Join a growing community of testers where you can ask questions, share knowledge,
                                    and collaborate on projects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics Covered */}
                <div className="topics-section" data-aos="fade-up">
                    <div className="section-header">
                        <h2>Topics We Cover</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6" data-aos="fade-right">
                            <ul className="topics-list">
                                <li><FontAwesomeIcon icon={faCheckCircle} /> Automation Testing (Selenium, Cypress, Appium)</li>
                                <li><FontAwesomeIcon icon={faCheckCircle} /> Manual Testing Techniques</li>
                                <li><FontAwesomeIcon icon={faCheckCircle} /> Agile Testing Methodologies</li>
                                <li><FontAwesomeIcon icon={faCheckCircle} /> API Testing (Postman, REST Assured)</li>
                            </ul>
                        </div>
                        <div className="col-md-6" data-aos="fade-left">
                            <ul className="topics-list">
                                <li><FontAwesomeIcon icon={faCheckCircle} /> Performance Testing (JMeter, LoadRunner)</li>
                                <li><FontAwesomeIcon icon={faCheckCircle} /> Security Testing Fundamentals</li>
                                <li><FontAwesomeIcon icon={faCheckCircle} /> Mobile Testing Strategies</li>
                                <li><FontAwesomeIcon icon={faCheckCircle} /> CI/CD Integration for Testing</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Commitment Section */}
                <div className="commitment-section" data-aos="fade-up">
                    <div className="commitment-card">
                        <h2>Our Commitment to Excellence</h2>
                        <p>
                            At QA Hub, we're dedicated to maintaining the highest standards in software testing education.
                            Our team continuously updates content to reflect the latest industry trends, tools, and best
                            practices. We measure our success by your career growth and the positive impact you make in
                            the software quality assurance field.
                        </p>
                        <div className="stats-container">
                            <div className="stat-item" data-aos="zoom-in" data-aos-delay="100">
                                <div className="stat-number">10,000+</div>
                                <div className="stat-label">Active Learners</div>
                            </div>
                            <div className="stat-item" data-aos="zoom-in" data-aos-delay="200">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Industry Experts</div>
                            </div>
                            <div className="stat-item" data-aos="zoom-in" data-aos-delay="300">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Content Access</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;