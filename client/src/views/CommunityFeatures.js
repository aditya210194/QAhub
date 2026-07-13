import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "./CommunityFeatures.css";
import forum from "../images/forum.jpg";
import QA from "../images/QA.png";
import Mentorship from "../images/Mentorship.jpg";
import { FaComments, FaQuestionCircle, FaUsers, FaTrophy, FaArrowRight, FaLock } from "react-icons/fa";

const CommunityFeatures = () => {
    const router = useRouter();

    const isLoggedIn = sessionStorage.getItem("token");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14
            }
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
            stats: "2.5k+ Discussions",
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
            stats: "5k+ Answered",
            delay: 0.1
        },
        {
            id: 3,
            title: "Mentorship Program",
            description: "Connect with experienced QA professionals for guidance and career growth.",
            icon: <FaUsers />,
            image: Mentorship,
            path: "/community-features/qa/mentorship-program",
            color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            stats: "100+ Mentors",
            delay: 0.2,
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
            delay: 0.3
        }
    ];

    const handleNavigation = (path) => {
        if (isLoggedIn) {
            router.push(path);
        } else {
            router.push(`/login?next=${encodeURIComponent(path)}`);

        }
    };

    return (
        <div className="community-features">
            {/* Hero Section - Reduced Height */}
            <motion.div
                className="hero-section-compact"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="hero-content-compact">
                    <h1 className="hero-title-compact">
                        Welcome to the
                        <span className="gradient-text"> QA Community</span>
                    </h1>
                    <p className="hero-subtitle-compact">
                        Connect, learn, and grow with thousands of QA professionals worldwide
                    </p>
                    <div className="hero-stats-compact">
                        <div className="stat-item-compact">
                            <span className="stat-number-compact">10k+</span>
                            <span className="stat-label-compact">Members</span>
                        </div>
                        <div className="stat-item-compact">
                            <span className="stat-number-compact">5k+</span>
                            <span className="stat-label-compact">Discussions</span>
                        </div>
                        <div className="stat-item-compact">
                            <span className="stat-number-compact">100+</span>
                            <span className="stat-label-compact">Mentors</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Features Grid - Horizontal Scroll / Single Line */}
            <motion.div
                className="features-container-horizontal"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="features-scroll-wrapper">
                    <div className="features-horizontal-grid">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.id}
                                className="feature-card-compact"
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div
                                    className="card-content-compact"
                                    style={{ background: feature.color }}
                                >
                                    <div className="card-header">
                                        <motion.div
                                            className="card-icon-compact"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <div className="card-stats-compact">
                                            <span className="stats-badge-compact">{feature.stats}</span>
                                        </div>
                                    </div>

                                    <h3 className="card-title-compact">{feature.title}</h3>
                                    <p className="card-description-compact">{feature.description}</p>

                                    <motion.button
                                        className={`card-button-compact ${!isLoggedIn ? 'locked' : ''} ${feature.comingSoon ? 'coming-soon' : ''}`}
                                        onClick={() => !feature.comingSoon && handleNavigation(feature.path)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={feature.comingSoon}
                                    >
                                        {feature.comingSoon ? (
                                            "Coming Soon"
                                        ) : !isLoggedIn ? (
                                            <>
                                                <FaLock className="button-icon" />
                                                Login
                                                <FaArrowRight className="button-arrow" />
                                            </>
                                        ) : (
                                            <>
                                                Explore
                                                <FaArrowRight className="button-arrow" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                                <div
                                    className="card-background-compact"
                                    style={{ backgroundImage: `url(${feature.image})` }}
                                ></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* CTA Section */}
            {!isLoggedIn && (
                <motion.div
                    className="cta-section-compact"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="cta-content-compact">
                        <h2>Ready to join the conversation?</h2>
                        <p>Create an account and start connecting with QA professionals worldwide</p>
                        <div className="cta-buttons-compact">
                            <motion.button
                                className="cta-button-compact primary"
                                onClick={() => router.push("/register")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign Up Now
                            </motion.button>
                            <motion.button
                                className="cta-button-compact secondary"
                                onClick={() => router.push("/login")}
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