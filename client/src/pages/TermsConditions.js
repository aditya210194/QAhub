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
    FaFileContract,
    FaUserLock,
    FaUpload,
    FaLightbulb,
    FaTrademark,
    FaLink,
    FaComments
} from "react-icons/fa";
import "./TermsConditions.css";
import { Helmet } from 'react-helmet-async';

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
            content: "By using QA Hub, you agree to these Terms & Conditions. If you do not agree, please do not use our website. These Terms form a legally binding agreement between you and QA Hub regarding your use of the Service."
        },
        {
            icon: <FaFileContract />,
            title: "2. Interpretation and Definitions",
            content: "",
            subsections: [
                {
                    subtitle: "Interpretation",
                    text: "The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural."
                },
                {
                    subtitle: "Definitions",
                    text: "For the purposes of these Terms and Conditions:",
                    items: [
                        "Affiliate means an entity that controls, is controlled by, or is under common control with a party.",
                        "Country refers to: Haryana, India",
                        "Company (referred to as 'We', 'Us', or 'Our') refers to QA Hub.",
                        "Device means any device that can access the Service such as a computer, a cell phone or a digital tablet.",
                        "Service refers to the Website.",
                        "Website refers to QA Hub, accessible from https://www.qahub.co.in/",
                        "You means the individual accessing or using the Service."
                    ]
                }
            ]
        },
        {
            icon: <FaUsers />,
            title: "3. Use of Our Website",
            content: "QA Hub provides an online platform for sharing quality assurance and technical knowledge. You agree to use the website responsibly and not engage in any unlawful activities. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms."
        },
        {
            icon: <FaUserLock />,
            title: "4. User Accounts",
            content: "",
            subsections: [
                {
                    subtitle: "Account Creation and Responsibility",
                    text: "When You create an account with Us, You must provide accurate, complete, and current information. Failure to do so constitutes a breach of these Terms, which may result in immediate termination of Your account.",
                    items: [
                        "You are responsible for safeguarding the password that You use to access the Service",
                        "You are responsible for any activities or actions under Your password",
                        "You agree not to disclose Your password to any third party",
                        "You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account",
                        "You may not use a username that is offensive, vulgar, or obscene"
                    ]
                }
            ]
        },
        {
            icon: <FaUpload />,
            title: "5. User Content",
            content: "",
            subsections: [
                {
                    subtitle: "Content Ownership and License",
                    text: "The Service allows You to create, upload, post, send, receive, and store content, including but not limited to text, images, code snippets, and other materials ('User Content'). You retain all ownership rights to Your User Content.",
                    items: [
                        "By submitting, posting, or displaying User Content, You grant Us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, modify, publish, and distribute such User Content solely for the purpose of operating, providing, and improving the Service.",
                        "You represent and warrant that You own or have the necessary licenses, rights, consents, and permissions to publish the User Content.",
                        "Your User Content does not infringe the intellectual property rights, privacy rights, or any other rights of any third party.",
                        "Your User Content complies with these Terms and all applicable laws."
                    ]
                },
                {
                    subtitle: "Content Moderation",
                    text: "We reserve the right, but not the obligation, to review, monitor, edit, or remove any User Content at Our sole discretion.",
                    items: [
                        "Content that is illegal, offensive, defamatory, or discriminatory",
                        "Content that infringes third-party intellectual property rights",
                        "Content containing malware, viruses, or harmful code",
                        "Content that violates any applicable law or regulation"
                    ]
                }
            ]
        },
        {
            icon: <FaLightbulb />,
            title: "6. Feedback and Suggestions",
            content: "",
            subsections: [
                {
                    subtitle: "Use of Feedback",
                    text: "If You provide Us with any feedback, suggestions, ideas, improvements, or other contributions regarding the Service ('Feedback'), You agree that We may use, disclose, reproduce, license, distribute, and otherwise exploit such Feedback without any restriction, compensation, credit, or acknowledgment to You.",
                    items: [
                        "All Feedback is provided 'AS IS' without any warranties of any kind",
                        "You acknowledge that We may already be working on or considering similar ideas",
                        "Your submission does not entitle You to any claim or compensation",
                        "By submitting Feedback, You represent and warrant that You have the right to provide the Feedback",
                        "The Feedback does not violate any third-party rights or any confidentiality obligations"
                    ]
                }
            ]
        },
        {
            icon: <FaTrademark />,
            title: "7. Intellectual Property",
            content: "",
            subsections: [
                {
                    subtitle: "Ownership",
                    text: "The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, audio, and the design, selection, and arrangement thereof) are owned by the Company, its licensors, or other providers of such material and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
                    items: [
                        "The Company name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of the Company or its affiliates.",
                        "You must not use such marks without the prior written permission of the Company.",
                        "These Terms permit You to use the Service for Your personal, non-commercial use only.",
                        "You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on Our Service, except as incidental to normal web browsing."
                    ]
                }
            ]
        },
        {
            icon: <FaLink />,
            title: "8. Links to Other Websites",
            content: "Our Service may contain links to third-party websites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit."
        },
        {
            icon: <FaComments />,
            title: "9. Third-Party Social Media Services",
            content: "The Service may display, include, make available, or link to content or services provided by a Third-Party Social Media Service. A Third-Party Social Media Service is not owned or controlled by the Company, and the Company does not endorse or assume responsibility for any Third-Party Social Media Service. Your use of any Third-Party Social Media Service is governed by that Third-Party Social Media Service's terms and privacy policies."
        },
        {
            icon: <FaBan />,
            title: "10. Termination",
            content: "We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately."
        },
        {
            icon: <FaExclamationTriangle />,
            title: "11. Limitation of Liability",
            content: "To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service). The entire liability of the Company under any provision of these Terms and Your exclusive remedy shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service."
        },
        {
            icon: <FaShieldAlt />,
            title: "12. 'AS IS' and 'AS AVAILABLE' Disclaimer",
            content: "The Service is provided to You 'AS IS' and 'AS AVAILABLE' with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service."
        },
        {
            icon: <FaGavel />,
            title: "13. Governing Law and Disputes Resolution",
            content: "",
            subsections: [
                {
                    subtitle: "Governing Law",
                    text: "The laws of the Country (Haryana, India), excluding its conflicts of law rules, shall govern these Terms and Your use of the Service."
                },
                {
                    subtitle: "Disputes Resolution",
                    text: "If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company."
                }
            ]
        },
        {
            icon: <FaUsers />,
            title: "14. Severability and Waiver",
            content: "If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect. The failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter."
        },
        {
            icon: <FaSync />,
            title: "15. Changes to These Terms",
            content: "We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service."
        }
    ];

    return (
        <div className="terms-page">
            <Helmet>
                <title>Terms & Conditions | QA Hub</title>
                <meta name="description" content="Read QA Hub's terms and conditions for using our software testing education platform and services." />
                <meta property="og:title" content="Terms & Conditions | QA Hub" />
                <meta property="og:url" content="https://www.qahub.co.in/terms-and-conditions" />
            </Helmet>

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
                        Last updated: April 21, 2026
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
                        Welcome to QA Hub! By accessing or using our website, you agree to comply with
                        these terms and conditions. Please read them carefully before using our services.
                        These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                    </p>

                    {/* Sections */}
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            className="terms-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                        >
                            <div className="section-header">
                                <div className="section-icon">
                                    {section.icon}
                                </div>
                                <h2>{section.title}</h2>
                            </div>

                            {section.subsections ? (
                                section.subsections.map((sub, subIndex) => (
                                    <div key={subIndex} className="terms-subsection">
                                        {sub.subtitle && <h3>{sub.subtitle}</h3>}
                                        {sub.text && <p>{sub.text}</p>}
                                        {sub.items && (
                                            <ul className="terms-list">
                                                {sub.items.map((item, itemIndex) => (
                                                    <li key={itemIndex}>
                                                        <span className="list-bullet">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>{section.content}</p>
                            )}
                        </motion.div>
                    ))}

                    {/* Contact Section */}
                    <motion.div
                        className="contact-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        <h2>16. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about these Terms & Conditions,
                            please don't hesitate to reach out to our team.
                        </p>
                        <motion.button
                            className="contact-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = "https://www.qahub.co.in/contact"}
                        >
                            <FaEnvelope /> Contact Us <FaArrowUp className="arrow-icon" />
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