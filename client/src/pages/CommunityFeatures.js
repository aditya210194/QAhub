import React from "react";
import { motion } from "framer-motion";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CommunityFeatures.css";
import forum from "../images/forum.jpg";
import QA from "../images/QA.png";
import Mentorship from "../images/Mentorship.jpg";
import Leaderboards from "../images/Leaderboards.png";

const CommunityFeatures = () => {
    const navigate = useNavigate();
    const isLoggedIn = sessionStorage.getItem("token"); // Check authentication

    return (
        <div className="community-features">
            <motion.h1 className="heading">Community Features</motion.h1>
            <div className="card-container">
                {/* Discussion Forum */}
                <Card className="community-card">
                    <motion.div
                        initial={{ opacity: 0.9, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card.Img variant="top" src={forum} alt="Forum" />
                        <Card.Body>
                            <Card.Title>Discussion Forum</Card.Title>
                            <Card.Text>Engage in QA discussions and share insights.</Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => navigate(isLoggedIn ? "/community-features/discussion-forums" : "/login")}>
                                {isLoggedIn ? "Explore Forum" : "Login to Access"}
                            </Button>

                        </Card.Body>
                    </motion.div>
                </Card>

                {/* Q&A Section */}
                <Card className="community-card">
                    <motion.div
                        initial={{ opacity: 0.9, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card.Img variant="top" src={QA} alt="Q&A" />
                        <Card.Body>
                            <Card.Title>Q&A Section</Card.Title>
                            <Card.Text>Ask and answer QA-related questions.</Card.Text>
                            <Button
                                variant={isLoggedIn ? "primary" : "secondary"}
                                onClick={() => navigate(isLoggedIn ? "/community-features/qa" : "/login")}
                            >
                                {isLoggedIn ? "Explore Q&A" : "Login to Access"}
                            </Button>
                        </Card.Body>
                    </motion.div>
                </Card>

                {/* Mentorship Program */}
                {/*
                <Card className="community-card">
                    <motion.div
                        initial={{ opacity: 0.9, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card.Img variant="top" src={Mentorship} alt="Mentorship" />
                        <Card.Body>
                            <Card.Title>Mentorship Program</Card.Title>
                            <Card.Text>Connect with experienced QA professionals.</Card.Text>
                            <Button
                                variant="secondary"
                                onClick={() => window.location.href = "/community-features/qa/mentorship-program"}
                            >
                                Join Now
                            </Button>
                        </Card.Body>
                    </motion.div>
                </Card>*/}

                {/* Leaderboards */}
                {/*
                <Card className="community-card">
                    <motion.div
                        initial={{ opacity: 0.9, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card.Img variant="top" src={Leaderboards} alt="Leaderboards" />
                        <Card.Body>
                            <Card.Title>Leaderboards</Card.Title>
                            <Card.Text>Earn points and showcase your QA expertise.</Card.Text>
                            <Button variant="secondary" disabled>Coming Soon</Button>
                        </Card.Body>
                    </motion.div>
                </Card>*/}
            </div>
        </div>
    );
};

export default CommunityFeatures;
