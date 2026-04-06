import React, { useState, useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
    FaFilePdf, FaUpload, FaPlus, FaLightbulb,
    FaCheckCircle, FaArrowRight, FaDownload,
    FaSearch, FaFilter, FaBookmark, FaStar,
    FaTimes, FaChevronLeft, FaChevronRight,
    FaRobot, FaChartLine, FaShieldAlt, FaBug,
    FaRocket, FaCog, FaUsers, FaTrophy,
    FaCode, FaMobile, FaCloud, FaDatabase,
    FaServer, FaWrench, FaTools, FaGraduationCap,
    FaClock, FaAward, FaCertificate, FaBriefcase,
    FaRegFilePdf
} from "react-icons/fa";
import sampleResume1 from "../resumes/sampleResume1.pdf";
import sampleResume2 from "../resumes/sampleResume2.pdf";
import sampleResume3 from "../resumes/sampleResume3.pdf";
import sampleResume4 from "../resumes/sampleResume4.pdf";
import sampleResume5 from "../resumes/sampleResume5.pdf";
import sampleResume6 from "../resumes/sampleResume6.pdf";
import sampleResume7 from "../resumes/sampleResume7.pdf";
import sampleResume8 from "../resumes/sampleResume8.pdf";
import sampleResume9 from "../resumes/sampleResume9.pdf";
import sampleResume10 from "../resumes/sampleResume10.pdf";
import "./Resumes.css";

const Resumes = () => {
    const navigate = useNavigate();
    const [selectedResume, setSelectedResume] = useState(sampleResume1);
    const [uploadedResume, setUploadedResume] = useState(null);
    const [uploadedFileData, setUploadedFileData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pdfKey, setPdfKey] = useState(Date.now());
    const [searchTerm, setSearchTerm] = useState("");
    const [showTips, setShowTips] = useState(true);
    const [activeTab, setActiveTab] = useState("profiles");
    const [selectedTipCategory, setSelectedTipCategory] = useState("all");
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('resumeFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('resumeFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const resumeProfiles = [
        { id: 1, title: "Software QA Engineer", file: sampleResume1, icon: "🔍", level: "Senior", experience: "5+ years" },
        { id: 2, title: "Software Test Engineer", file: sampleResume2, icon: "🧪", level: "Mid", experience: "3+ years" },
        { id: 3, title: "Test Analyst", file: sampleResume3, icon: "📊", level: "Senior", experience: "4+ years" },
        { id: 4, title: "QA Tester", file: sampleResume4, icon: "✅", level: "Entry", experience: "1+ years" },
        { id: 5, title: "QA Automation Engineer", file: sampleResume5, icon: "⚙️", level: "Senior", experience: "5+ years" },
        { id: 6, title: "Performance Testing Engineer", file: sampleResume6, icon: "🚀", level: "Mid", experience: "3+ years" },
        { id: 7, title: "Senior QA Engineer", file: sampleResume7, icon: "👑", level: "Lead", experience: "7+ years" },
        { id: 8, title: "QA Lead", file: sampleResume8, icon: "🎯", level: "Lead", experience: "8+ years" },
        { id: 9, title: "SDET", file: sampleResume9, icon: "💻", level: "Senior", experience: "4+ years" },
        { id: 10, title: "QA Manager", file: sampleResume10, icon: "📋", level: "Manager", experience: "10+ years" },
    ];

    const filteredProfiles = resumeProfiles.filter(profile =>
        profile.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Comprehensive ATS-Friendly Resume Tips for QA Professionals
    const resumeTips = {
        atsBasics: [
            {
                id: 1,
                title: "Use Standard Formatting",
                icon: <FaRegFilePdf />,
                description: "Avoid tables, columns, text boxes, and graphics. Use standard fonts like Arial, Calibri, or Times New Roman (10-12pt).",
                details: "ATS systems often can't parse complex formatting. Stick to a simple, clean layout with clear section headings."
            },
            {
                id: 2,
                title: "Include Relevant Keywords",
                icon: <FaCode />,
                description: "Mirror keywords from the job description. For QA roles, include terms like: Selenium, TestNG, JUnit, Jenkins, Agile, etc.",
                details: "ATS systems scan for specific keywords. Include both explicit terms (e.g., 'Selenium') and implicit ones (e.g., 'automation testing')."
            },
            {
                id: 3,
                title: "Save as PDF (but check ATS compatibility)",
                icon: <FaFilePdf />,
                description: "Most ATS accept PDFs, but some prefer .docx. When in doubt, use .docx for better parsing.",
                details: "Some older ATS systems can't read PDFs properly. Consider submitting both formats if possible."
            },
            {
                id: 4,
                title: "Avoid Headers & Footers",
                icon: <FaTimes />,
                description: "Don't put important information (contact details) in headers/footers as ATS often miss them.",
                details: "Place your name, phone, email, and LinkedIn in the main body of the resume."
            },
            {
                id: 5,
                title: "Use Standard Section Headings",
                icon: <FaCheckCircle />,
                description: "Use common headings like 'Work Experience,' 'Education,' 'Skills,' 'Certifications.'",
                details: "ATS systems are programmed to recognize standard headings. Avoid creative alternatives."
            }
        ],
        qaSpecificKeywords: [
            {
                id: 6,
                title: "Automation Tools",
                icon: <FaCog />,
                description: "Selenium, Cypress, Playwright, Appium, Katalon, Robot Framework, TestComplete",
                details: "List specific tools you've used. Include version numbers if relevant (e.g., Selenium WebDriver 4.0)."
            },
            {
                id: 7,
                title: "Testing Types",
                icon: <FaBug />,
                description: "Functional, Regression, Integration, Unit, Performance, Load, Stress, Security, API, Mobile, UI/UX",
                details: "Demonstrate breadth of experience by mentioning different testing types you've performed."
            },
            {
                id: 8,
                title: "Programming Languages",
                icon: <FaCode />,
                description: "Java, Python, JavaScript, C#, Ruby, PHP, SQL, TypeScript",
                details: "Include languages used for test automation. Specify proficiency level (e.g., 'Expert in Java')."
            },
            {
                id: 9,
                title: "CI/CD Tools",
                icon: <FaRocket />,
                description: "Jenkins, GitLab CI, GitHub Actions, CircleCI, Travis CI, Bamboo",
                details: "Mention how you integrated tests into CI/CD pipelines. Show DevOps knowledge."
            },
            {
                id: 10,
                title: "Bug Tracking Tools",
                icon: <FaDatabase />,
                description: "JIRA, Bugzilla, Trello, Asana, Azure DevOps, TestRail, qTest",
                details: "Include experience with bug lifecycle management and test case management tools."
            },
            {
                id: 11,
                title: "API Testing Tools",
                icon: <FaServer />,
                description: "Postman, SoapUI, REST Assured, Swagger, Insomnia, GraphQL",
                details: "Show expertise in API testing methodologies and automation."
            },
            {
                id: 12,
                title: "Performance Testing Tools",
                icon: <FaChartLine />,
                description: "JMeter, LoadRunner, Gatling, k6, BlazeMeter, NeoLoad",
                details: "Include metrics you've measured (response time, throughput, concurrent users)."
            },
            {
                id: 13,
                title: "Security Testing",
                icon: <FaShieldAlt />,
                description: "OWASP, Burp Suite, ZAP, SonarQube, Fortify, Penetration Testing",
                details: "Highlight security testing experience, even if basic. Mention specific vulnerabilities found."
            },
            {
                id: 14,
                title: "Mobile Testing",
                icon: <FaMobile />,
                description: "Appium, XCUITest, Espresso, Detox, Perfecto, Sauce Labs, BrowserStack",
                details: "Specify platforms (iOS, Android) and device types (phones, tablets)."
            },
            {
                id: 15,
                title: "Cloud Testing",
                icon: <FaCloud />,
                description: "AWS Device Farm, Sauce Labs, BrowserStack, LambdaTest, Kobiton",
                details: "Show experience with cloud-based testing platforms and cross-browser testing."
            },
            {
                id: 16,
                title: "Database Testing",
                icon: <FaDatabase />,
                description: "SQL, NoSQL, MongoDB, PostgreSQL, MySQL, Oracle, Data Validation",
                details: "Include experience writing complex queries and validating data integrity."
            },
            {
                id: 17,
                title: "Agile Methodologies",
                icon: <FaUsers />,
                description: "Scrum, Kanban, SAFe, Agile Testing, Sprint Planning, Retrospectives",
                details: "Show participation in agile ceremonies and collaboration with cross-functional teams."
            }
        ],
        actionVerbs: [
            {
                id: 18,
                title: "Strong Action Verbs",
                icon: <FaRocket />,
                description: "Developed, Implemented, Automated, Designed, Executed, Analyzed, Optimized, Led, Coordinated",
                details: "Start each bullet point with a strong action verb. Avoid passive language."
            },
            {
                id: 19,
                title: "Quantifiable Achievements",
                icon: <FaChartLine />,
                description: "Use numbers: 'Increased test coverage by 40%', 'Reduced bug rate by 25%', 'Automated 500+ test cases'",
                details: "Quantify your impact whenever possible. Use percentages, numbers, and time frames."
            },
            {
                id: 20,
                title: "Problem-Solving Examples",
                icon: <FaWrench />,
                description: "Debugged, Troubleshot, Resolved, Identified, Prevented, Mitigated",
                details: "Show how you solved specific testing challenges or prevented production issues."
            }
        ],
        certifications: [
            {
                id: 21,
                title: "ISTQB Certifications",
                icon: <FaCertificate />,
                description: "ISTQB Foundation Level, Advanced Level, Expert Level",
                details: "ISTQB is the most recognized QA certification worldwide. Include Foundation Level at minimum."
            },
            {
                id: 22,
                title: "Automation Certifications",
                icon: <FaCog />,
                description: "Selenium WebDriver with Java/C#, Cypress Certification, Appium Mobile",
                details: "Vendor-specific certifications show deep expertise in specific tools."
            },
            {
                id: 23,
                title: "Cloud Certifications",
                icon: <FaCloud />,
                description: "AWS Certified DevOps, Azure DevOps, Google Cloud DevOps Engineer",
                details: "Cloud certifications show understanding of modern testing environments."
            },
            {
                id: 24,
                title: "Security Certifications",
                icon: <FaShieldAlt />,
                description: "CISSP, CEH, CompTIA Security+, GIAC",
                details: "Security testing is highly valued. Even entry-level security certs help."
            },
            {
                id: 25,
                title: "Agile Certifications",
                icon: <FaUsers />,
                description: "Certified Scrum Master (CSM), SAFe Agilist, PMI-ACP",
                details: "Show understanding of agile methodologies beyond just 'working in sprints'."
            }
        ],
        commonMistakes: [
            {
                id: 26,
                title: "Spelling & Grammar Errors",
                icon: <FaTimes />,
                description: "ATS penalizes spelling mistakes. Proofread multiple times and use tools like Grammarly.",
                details: "Even one typo can signal lack of attention to detail - critical for QA roles."
            },
            {
                id: 27,
                title: "Generic Objectives",
                icon: <FaTimes />,
                description: "Avoid 'Seeking a challenging position...' Use a professional summary with specific skills.",
                details: "Tailor your summary to each role. Mention specific QA skills and years of experience."
            },
            {
                id: 28,
                title: "Too Much Text",
                icon: <FaTimes />,
                description: "Keep resumes to 1-2 pages. Use bullet points and white space effectively.",
                details: "ATS systems truncate long resumes. Focus on most recent and relevant experience."
            },
            {
                id: 29,
                title: "Missing Contact Info",
                icon: <FaTimes />,
                description: "Include email, phone, LinkedIn, GitHub/portfolio (if relevant to QA).",
                details: "Make it easy for recruiters to contact you. Include location if willing to relocate."
            }
        ],
        formattingTips: [
            {
                id: 30,
                title: "File Name",
                icon: <FaFilePdf />,
                description: "Name your file: FirstName_LastName_QA_Resume.pdf (not 'resume.pdf')",
                details: "Recruiters download many resumes. Make yours easy to identify."
            },
            {
                id: 31,
                title: "Consistent Formatting",
                icon: <FaCheckCircle />,
                description: "Use consistent date formats, bullet styles, and heading sizes throughout.",
                details: "Inconsistent formatting can confuse ATS parsers and looks unprofessional."
            },
            {
                id: 32,
                title: "Reverse Chronological Order",
                icon: <FaClock />,
                description: "List most recent experience first. Include month/year for each role.",
                details: "ATS systems expect reverse chronological order. Gaps? Explain briefly in cover letter."
            }
        ],
        qaAchievements: [
            {
                id: 33,
                title: "Test Coverage",
                icon: <FaChartLine />,
                description: "Example: 'Increased test coverage from 60% to 85% within 6 months'",
                details: "Quantify how you improved testing processes or coverage."
            },
            {
                id: 34,
                title: "Bug Detection",
                icon: <FaBug />,
                description: "Example: 'Identified and documented 200+ critical bugs during regression testing'",
                details: "Show your impact in finding and preventing defects."
            },
            {
                id: 35,
                title: "Automation Impact",
                icon: <FaRocket />,
                description: "Example: 'Automated 300+ test cases, reducing regression testing time by 70%'",
                details: "Demonstrate time/cost savings through automation."
            },
            {
                id: 36,
                title: "Process Improvement",
                icon: <FaTools />,
                description: "Example: 'Implemented CI/CD pipeline reducing deployment failures by 40%'",
                details: "Show how you improved QA processes and workflows."
            },
            {
                id: 37,
                title: "Team Leadership",
                icon: <FaUsers />,
                description: "Example: 'Led team of 5 testers, mentored 3 junior QA engineers'",
                details: "Highlight leadership and mentoring experience."
            },
            {
                id: 38,
                title: "Awards & Recognition",
                icon: <FaTrophy />,
                description: "Example: 'Received 'Employee of the Quarter' for exceptional bug detection'",
                details: "Include any recognition or awards received."
            }
        ]
    };

    const tipCategories = [
        { id: "all", name: "All Tips", icon: <FaLightbulb /> },
        { id: "atsBasics", name: "ATS Basics", icon: <FaFilePdf /> },
        { id: "qaSpecificKeywords", name: "QA Keywords", icon: <FaCode /> },
        { id: "actionVerbs", name: "Action Verbs", icon: <FaRocket /> },
        { id: "certifications", name: "Certifications", icon: <FaCertificate /> },
        { id: "commonMistakes", name: "Common Mistakes", icon: <FaTimes /> },
        { id: "formattingTips", name: "Formatting Tips", icon: <FaCheckCircle /> },
        { id: "qaAchievements", name: "QA Achievements", icon: <FaTrophy /> }
    ];

    const handleResumeChange = (resumePath) => {
        setIsLoading(true);
        setSelectedResume(resumePath);
        setError("");
        setPdfKey(Date.now());
        setTimeout(() => setIsLoading(false), 500);
    };

    // Updated file upload handler with navigation to resume generator
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Please upload a valid PDF file.");
                setUploadedResume(null);
                return;
            }

            setIsLoading(true);

            try {
                // Read the file as ArrayBuffer for text extraction
                const arrayBuffer = await file.arrayBuffer();

                // Create file URL for preview
                const fileURL = URL.createObjectURL(file);
                setUploadedResume(fileURL);
                setSelectedResume(fileURL);

                // Store file data to pass to resume generator
                const fileData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    arrayBuffer: arrayBuffer, // Store for potential text extraction
                    objectURL: fileURL
                };

                setUploadedFileData(fileData);
                setError("");
                setPdfKey(Date.now());

                // Show success message
                setError(""); // Clear any previous errors

                // Navigate to resume generator after a short delay to show loading state
                setTimeout(() => {
                    setIsLoading(false);
                    // Navigate with state containing the uploaded file data
                    navigate("/resume-generator", {
                        state: {
                            uploadedFile: fileData,
                            source: 'resume-upload',
                            timestamp: Date.now()
                        }
                    });
                }, 1000);

            } catch (err) {
                console.error("Error processing file:", err);
                setError("Error processing file. Please try again.");
                setIsLoading(false);
            }
        }
    };

    const handleCreateResume = () => {
        navigate("/resume-generator");
    };

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    React.useEffect(() => {
        return () => {
            if (uploadedResume) {
                URL.revokeObjectURL(uploadedResume);
            }
        };
    }, [uploadedResume]);

    // Get all tips or filtered by category
    const getDisplayTips = () => {
        if (selectedTipCategory === "all") {
            return Object.values(resumeTips).flat();
        }
        return resumeTips[selectedTipCategory] || [];
    };

    return (
        <div className="resumes-page">
            {/* Header Section */}
            <div className="resumes-header">
                <div className="header-content">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaFilePdf className="header-icon" />
                        Resume Library
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Browse professional QA resumes and get ATS-friendly tips
                    </motion.p>
                </div>
            </div>

            <div className="resumes-container">
                {/* Tips Banner - Enhanced with more info */}
                <AnimatePresence>
                    {showTips && (
                        <motion.div
                            className="tips-banner enhanced"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="tips-content">
                                <FaLightbulb className="tips-icon pulse" />
                                <div className="tips-text">
                                    <strong>🚀 ATS-Friendly Resume Tips for QA Professionals:</strong>
                                    <ul>
                                        <li>✓ Use standard formatting (no tables/columns)</li>
                                        <li>✓ Include QA-specific keywords (Selenium, JIRA, Agile, etc.)</li>
                                        <li>✓ Quantify achievements with numbers and percentages</li>
                                        <li>✓ List relevant certifications (ISTQB, etc.)</li>
                                        <li>✓ Save as PDF but ensure ATS compatibility</li>
                                    </ul>
                                </div>
                                <button
                                    className="tips-close"
                                    onClick={() => setShowTips(false)}
                                >
                                    ×
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Navigation */}
                <div className="resumes-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profiles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profiles')}
                    >
                        <FaFilePdf /> Resume Profiles
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tips')}
                    >
                        <FaLightbulb /> ATS Tips & Resources
                    </button>
                </div>

                {activeTab === 'profiles' ? (
                    <div className="resumes-layout">
                        {/* Left Sidebar */}
                        <motion.div
                            className="resumes-sidebar"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="sidebar-header">
                                <h3>Resume Profiles</h3>
                                <div className="search-box">
                                    <FaSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search profiles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="profiles-list">
                                {filteredProfiles.map((profile, index) => (
                                    <motion.button
                                        key={profile.id}
                                        className={`profile-btn ${selectedResume === profile.file ? 'active' : ''}`}
                                        onClick={() => handleResumeChange(profile.file)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="profile-icon">{profile.icon}</span>
                                        <div className="profile-info">
                                            <span className="profile-title">{profile.title}</span>
                                            <div className="profile-tags">
                                                <span className="profile-level">{profile.level}</span>
                                                <span className="profile-exp">{profile.experience}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`favorite-btn-small ${favorites.includes(profile.id) ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(profile.id);
                                            }}
                                        >
                                            <FaBookmark />
                                        </button>
                                        {selectedResume === profile.file && (
                                            <FaCheckCircle className="profile-check" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="sidebar-footer">
                                <div className="upload-section">
                                    <label className="upload-btn">
                                        <FaUpload className="upload-icon" />
                                        <span>Upload Resume</span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            hidden
                                        />
                                    </label>
                                    {error && <p className="error-message">{error}</p>}
                                </div>

                                <motion.button
                                    className="create-btn"
                                    onClick={handleCreateResume}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaPlus />
                                    <span>Create New Resume</span>
                                    <FaArrowRight className="arrow-icon" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Right Side: PDF Preview */}
                        <motion.div
                            className="resumes-preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="preview-header">
                                <h4>
                                    <FaFilePdf className="preview-icon" />
                                    Resume Preview
                                </h4>
                                <div className="preview-actions">
                                    <button className="action-btn" title="Download">
                                        <FaDownload />
                                    </button>
                                    <button className="action-btn" title="Bookmark">
                                        <FaBookmark />
                                    </button>
                                </div>
                            </div>

                            <div className="preview-container">
                                {isLoading ? (
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <p>Loading PDF...</p>
                                    </div>
                                ) : (
                                    <Worker workerUrl={`${process.env.PUBLIC_URL}/pdf.worker.min.js`}>
                                        <Viewer key={pdfKey} fileUrl={selectedResume} />
                                    </Worker>
                                )}
                            </div>

                            {/* Enhanced Quick Tips Section */}
                            <div className="quick-tips enhanced">
                                <h5>
                                    <FaLightbulb className="tips-icon-small" />
                                    Quick ATS-Friendly Resume Tips
                                </h5>
                                <div className="tips-grid">
                                    <div className="tip-item">
                                        <span className="tip-number">✓</span>
                                        <span>Use standard fonts (Arial, Calibri)</span>
                                    </div>
                                    <div className="tip-item">
                                        <span className="tip-number">✓</span>
                                        <span>Include QA keywords from job description</span>
                                    </div>
                                    <div className="tip-item">
                                        <span className="tip-number">✓</span>
                                        <span>Quantify achievements (%, numbers)</span>
                                    </div>
                                    <div className="tip-item">
                                        <span className="tip-number">✓</span>
                                        <span>Avoid tables and columns</span>
                                    </div>
                                    <div className="tip-item">
                                        <span className="tip-number">✓</span>
                                        <span>List ISTQB and other certifications</span>
                                    </div>
                                    <div className="tip-item">
                                        <span className="tip-number">✓</span>
                                        <span>Use reverse chronological order</span>
                                    </div>
                                </div>
                                <button
                                    className="view-all-tips-btn"
                                    onClick={() => setActiveTab('tips')}
                                >
                                    View All ATS Tips <FaArrowRight />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    /* Tips & Resources Tab */
                    <motion.div
                        className="tips-resources-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="tips-header">
                            <h2>
                                <FaLightbulb className="header-icon" />
                                ATS-Friendly Resume Guide for QA Professionals
                            </h2>
                            <p>Comprehensive tips to help your resume pass Applicant Tracking Systems and land interviews</p>
                        </div>

                        {/* Category Filter */}
                        <div className="tips-categories">
                            {tipCategories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`category-chip ${selectedTipCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setSelectedTipCategory(category.id)}
                                >
                                    {category.icon} {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Tips Grid */}
                        <div className="tips-grid-detailed">
                            {getDisplayTips().map((tip) => (
                                <motion.div
                                    key={tip.id}
                                    className="tip-detailed-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="tip-icon-wrapper">
                                        {tip.icon}
                                    </div>
                                    <div className="tip-content">
                                        <h3>{tip.title}</h3>
                                        <p className="tip-description">{tip.description}</p>
                                        <p className="tip-details">{tip.details}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Resources Section */}
                        <div className="additional-resources">
                            <h3>Additional Resources for QA Resumes</h3>
                            <div className="resources-grid">
                                <div className="resource-card">
                                    <FaCheckCircle className="resource-icon" />
                                    <h4>ATS Checklist</h4>
                                    <ul>
                                        <li>✓ Simple formatting (no tables)</li>
                                        <li>✓ Keywords from job description</li>
                                        <li>✓ Standard section headings</li>
                                        <li>✓ Contact info in body (not header)</li>
                                        <li>✓ PDF or DOCX format</li>
                                    </ul>
                                </div>
                                <div className="resource-card">
                                    <FaCode className="resource-icon" />
                                    <h4>Top QA Keywords</h4>
                                    <ul>
                                        <li>✓ Selenium, Cypress, Playwright</li>
                                        <li>✓ JIRA, TestRail, qTest</li>
                                        <li>✓ Agile, Scrum, Kanban</li>
                                        <li>✓ API Testing, Postman</li>
                                        <li>✓ CI/CD, Jenkins, GitLab</li>
                                    </ul>
                                </div>
                                <div className="resource-card">
                                    <FaRocket className="resource-icon" />
                                    <h4>Action Verbs for QA</h4>
                                    <ul>
                                        <li>✓ Automated, Developed</li>
                                        <li>✓ Executed, Validated</li>
                                        <li>✓ Analyzed, Optimized</li>
                                        <li>✓ Implemented, Designed</li>
                                        <li>✓ Led, Coordinated</li>
                                    </ul>
                                </div>
                                <div className="resource-card">
                                    <FaCertificate className="resource-icon" />
                                    <h4>Valuable Certifications</h4>
                                    <ul>
                                        <li>✓ ISTQB Foundation Level</li>
                                        <li>✓ Certified Scrum Master</li>
                                        <li>✓ AWS/Azure DevOps</li>
                                        <li>✓ Selenium WebDriver</li>
                                        <li>✓ Security+ / CISSP</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="tips-cta">
                            <h3>Ready to create your ATS-friendly QA resume?</h3>
                            <p>Use our resume builder with built-in ATS optimization</p>
                            <motion.button
                                className="create-resume-cta"
                                onClick={handleCreateResume}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPlus /> Create Your Resume Now
                                <FaArrowRight className="arrow-icon" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Resumes;