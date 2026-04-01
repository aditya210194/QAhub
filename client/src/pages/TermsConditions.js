import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCheckCircle,
    FaShieldAlt,
    FaUsers,
    FaCopyright,
    FaExclamationTriangle,
    FaBan,
    FaSync,
    FaGavel,
    FaEnvelope,
    FaArrowUp,
    FaFileContract
} from "react-icons/fa";
import "./TermsConditions.css";

const TermsConditions = () => {
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
            icon: <FaCheckCircle />,
            title: "1. Acceptance of Terms",
            content: "By using QAHub.Tech, you agree to these Terms & Conditions. If you do not agree, please do not use our website."
        },
        {
            icon: <FaUsers />,
            title: "2. Use of Our Website",
            content: "QAHub.Tech provides an online platform for sharing knowledge. You agree to use the website responsibly and not engage in any unlawful activities."
        },
        {
            icon: <FaFileContract />,
            title: "3. User-Generated Content",
            content: "You are responsible for the content you post. By submitting content, you grant QAHub.Tech a non-exclusive, royalty-free license to use, display, and distribute your content."
        },
        {
            icon: <FaCopyright />,
            title: "4. Intellectual Property",
            content: "All content, trademarks, and logos on QAHub.Tech are the property of QAHub.Tech or its licensors and are protected by copyright laws."
        },
        {
            icon: <FaExclamationTriangle />,
            title: "5. Limitation of Liability",
            content: "QAHub.Tech is not responsible for any direct, indirect, incidental, or consequential damages arising from the use of our website."
        },
        {
            icon: <FaBan />,
            title: "6. Termination",
            content: "We reserve the right to terminate or restrict access to our website at any time, without notice, for violations of these terms."
        },
        {
            icon: <FaSync />,
            title: "7. Changes to Terms",
            content: "We may update these Terms & Conditions at any time. Continued use of QAHub.Tech after changes constitutes acceptance of the revised terms."
        },
        {
            icon: <FaGavel />,
            title: "8. Governing Law",
            content: "These terms are governed by the laws of India. Any disputes shall be resolved in the appropriate courts of jurisdiction."
        }
    ];

    return (
        <div className="terms-page">
            {/* Header Section */}
            <motion.div
                className="terms-header"
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
                        Terms & Conditions
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
            <div className="terms-container">
                <motion.div
                    className="terms-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <p className="terms-intro">
                        Welcome to QAHub.Tech! By accessing or using our website, you agree to comply with
                        these terms and conditions. Please read them carefully before using our services.
                    </p>

                    {/* Sections */}
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            className="terms-section"
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
                        </motion.div>
                    ))}

                    {/* Contact Section */}
                    <motion.div
                        className="contact-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        <h2>9. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about these terms,
                            please don't hesitate to reach out to our team.
                        </p>
                        <motion.button
                            className="contact-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = "mailto:legal@qahub.tech"}
                        >
                            <FaEnvelope /> Contact Legal Team <FaArrowUp className="arrow-icon" />
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

export default TermsConditions;