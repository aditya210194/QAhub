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

const AboutUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    return (
        <div className="about-us">
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

            {/* Mission Section */}
            <div className="container">
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
                                <div className="stat-number">1000+</div>
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