import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaCookieBite, FaUsers, FaLock, FaHandsHelping, FaEnvelope, FaArrowUp } from "react-icons/fa";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sections = [
        {
            icon: <FaShieldAlt />,
            title: "1. Information We Collect",
            content: "We may collect the following types of information:",
            items: [
                "Personal information (e.g., name, email, contact details)",
                "Technical data (e.g., IP address, browser type, device information)",
                "Usage data (e.g., pages visited, time spent on the site)"
            ]
        },
        {
            icon: <FaUsers />,
            title: "2. How We Use Your Information",
            content: "We use your information for the following purposes:",
            items: [
                "To provide and improve our services",
                "To personalize user experience",
                "To send updates, newsletters, or important notifications",
                "To ensure website security and prevent fraud"
            ]
        },
        {
            icon: <FaCookieBite />,
            title: "3. Cookies and Tracking Technologies",
            content: "We use cookies and similar tracking technologies to enhance user experience, analyze trends, and administer the site. You can control cookie settings in your browser.",
            items: []
        },
        {
            icon: <FaUsers />,
            title: "4. Third-Party Services",
            content: "We may use third-party services for analytics, advertising, and other functionalities. These services may collect data as per their policies.",
            items: []
        },
        {
            icon: <FaLock />,
            title: "5. Data Security",
            content: "We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure.",
            items: []
        },
        {
            icon: <FaHandsHelping />,
            title: "6. Your Rights",
            content: "You have the right to access, update, or request the deletion of your personal information. To exercise these rights, contact us.",
            items: []
        }
    ];

    return (
        <div className="privacy-policy-page">
            {/* Header Section */}
            <motion.div
                className="privacy-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <motion.h1
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.div
                        className="effective-date"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Effective Date: 1st April 2026
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="privacy-container">
                <motion.div
                    className="policy-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <p className="policy-intro">
                        At QAHub.Tech, we respect your privacy and are committed to protecting your personal information.
                        This policy outlines how we collect, use, and safeguard your data.
                    </p>

                    {/* Sections */}
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            className="policy-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        >
                            <div className="section-header">
                                <div className="section-icon">
                                    {section.icon}
                                </div>
                                <h2>{section.title}</h2>
                            </div>

                            <p>{section.content}</p>

                            {section.items.length > 0 && (
                                <ul className="policy-list">
                                    {section.items.map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                                        >
                                            <span className="list-bullet">✓</span>
                                            <span>{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}

                    {/* Changes Section */}
                    <motion.div
                        className="policy-section"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                    >
                        <div className="section-header">
                            <div className="section-icon">
                                <FaShieldAlt />
                            </div>
                            <h2>7. Changes to This Policy</h2>
                        </div>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page
                            with an updated effective date.
                        </p>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        className="contact-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        <h2>8. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about our Privacy Policy,
                            please don't hesitate to reach out to us.
                        </p>
                        <motion.button
                            className="contact-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = "mailto:privacy@qahub.tech"}
                        >
                            <FaEnvelope /> Contact Privacy Team <FaArrowUp className="arrow-icon" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        className="back-to-top"
                        onClick={scrollToTop}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaArrowUp />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PrivacyPolicy;