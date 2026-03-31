import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./CommunityFeatures.css";
import forum from "../images/forum.jpg";
import QA from "../images/QA.png";
import Mentorship from "../images/Mentorship.jpg";
import { FaComments, FaQuestionCircle, FaUsers, FaTrophy, FaArrowRight, FaLock } from "react-icons/fa";

const CommunityFeatures = () => {
    const navigate = useNavigate();
    const isLoggedIn = sessionStorage.getItem("token");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const features = [
        {
            id: 1,
            title: "Discussion Forum",
            description: "Engage in QA discussions, share insights, and collaborate with fellow testers.",
            icon: <FaComments />,
            image: forum,
            path: "/community-features/discussion-forums",
            color: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            stats: "2.5k+ Active Discussions",
            delay: 0
        },
        {
            id: 2,
            title: "Q&A Section",
            description: "Ask questions, get answers, and help others solve testing challenges.",
            icon: <FaQuestionCircle />,
            image: QA,
            path: "/community-features/qa",
            color: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            stats: "5k+ Questions Answered",
            delay: 0.2
        },
        {
            id: 3,
            title: "Mentorship Program",
            description: "Connect with experienced QA professionals for guidance and career growth.",
            icon: <FaUsers />,
            image: Mentorship,
            path: "/community-features/qa/mentorship-program",
            color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            stats: "100+ Active Mentors",
            delay: 0.4,
            comingSoon: false
        },
        {
            id: 4,
            title: "Leaderboards",
            description: "Earn points, unlock achievements, and showcase your QA expertise.",
            icon: <FaTrophy />,
            image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            path: "/community-features/leaderboards",
            color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            stats: "Coming Soon",
            comingSoon: true,
            delay: 0.6
        }
    ];

   const handleNavigation = (path) => {
       if (isLoggedIn) {
           navigate(path);
       } else {
           // Encode the path to include it as a safe query parameter
           navigate(`/login?next=${encodeURIComponent(path)}`);
       }
   };

    return (
        <div className="community-features">
            {/* Hero Section */}
            <motion.div
                className="hero-section"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="hero-content"
                    animate={floatingAnimation}
                >
                    <h1 className="hero-title">
                        Welcome to the
                        <span className="gradient-text"> QA Community</span>
                    </h1>
                    <p className="hero-subtitle">
                        Connect, learn, and grow with thousands of QA professionals worldwide
                    </p>
                    <div className="hero-stats">
                        <motion.div
                            className="stat-item"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="stat-number">10k+</span>
                            <span className="stat-label">Members</span>
                        </motion.div>
                        <motion.div
                            className="stat-item"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="stat-number">5k+</span>
                            <span className="stat-label">Discussions</span>
                        </motion.div>
                        <motion.div
                            className="stat-item"
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="stat-number">100+</span>
                            <span className="stat-label">Mentors</span>
                        </motion.div>
                    </div>
                </motion.div>
                <div className="hero-pattern"></div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                className="features-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="features-grid">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            className="feature-card-wrapper"
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div
                                className="feature-card"
                                style={{ background: feature.color }}
                            >
                                <div className="card-content">
                                    <motion.div
                                        className="card-icon"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {feature.icon}
                                    </motion.div>

                                    <h3 className="card-title">{feature.title}</h3>
                                    <p className="card-description">{feature.description}</p>

                                    <div className="card-stats">
                                        <span className="stats-badge">{feature.stats}</span>
                                    </div>

                                    <motion.button
                                        className={`card-button ${!isLoggedIn ? 'locked' : ''} ${feature.comingSoon ? 'coming-soon' : ''}`}
                                        onClick={() => !feature.comingSoon && handleNavigation(feature.path)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={feature.comingSoon}
                                    >
                                        {feature.comingSoon ? (
                                            "Coming Soon"
                                        ) : !isLoggedIn ? (
                                            <>
                                                <FaLock className="button-icon" />
                                                Login to Access
                                                <FaArrowRight className="button-arrow" />
                                            </>
                                        ) : (
                                            <>
                                                Explore Now
                                                <FaArrowRight className="button-arrow" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Background Image Overlay */}
                                <div
                                    className="card-background"
                                    style={{ backgroundImage: `url(${feature.image})` }}
                                ></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Community Stats Section */}
            <motion.div
                className="community-stats-section"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="section-title">Join Our Growing Community</h2>
                <div className="stats-grid">
                    <motion.div
                        className="stat-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="stat-icon">🌍</div>
                        <div className="stat-detail">
                            <span className="stat-value">50+</span>
                            <span className="stat-label-countries">Countries</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="stat-icon">💬</div>
                        <div className="stat-detail">
                            <span className="stat-value">15k+</span>
                            <span className="stat-label-countries">Messages Daily</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="stat-icon">🏆</div>
                        <div className="stat-detail">
                            <span className="stat-value">500+</span>
                            <span className="stat-label-countries">Success Stories</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* CTA Section */}
            {!isLoggedIn && (
                <motion.div
                    className="cta-section"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="cta-content">
                        <h2>Ready to join the conversation?</h2>
                        <p>Create an account and start connecting with QA professionals worldwide</p>
                        <div className="cta-buttons">
                            <motion.button
                                className="cta-button primary"
                                onClick={() => navigate("/register")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign Up Now
                            </motion.button>
                            <motion.button
                                className="cta-button secondary"
                                onClick={() => navigate("/login")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Login
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CommunityFeatures;