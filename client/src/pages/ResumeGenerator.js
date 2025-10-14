import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Container, Button, Form, Row, Col, Card, ListGroup, OverlayTrigger,
    Tooltip, FloatingLabel, ButtonGroup, ProgressBar, Modal, Alert
} from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import {
    FaPlus, FaChartBar, FaUser, FaEnvelope, FaPhone,
    FaMagic, FaEdit, FaBriefcase, FaGraduationCap, FaCode,
    FaAward, FaTrash, FaDownload, FaCog, FaEye, FaPalette,
    FaColumns, FaQuestionCircle, FaCheck, FaExclamationTriangle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactSwitch from "react-switch";
import { debounce } from "lodash";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./ResumeGenerator.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Initial Resume Data
const initialResumeData = {
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: [{ company: "", position: "", duration: "", responsibilities: "" }],
    education: [{ institution: "", degree: "", duration: "", honors: "" }],
    skills: [],
    certifications: [],
    projects: [{ title: "", description: "", technologies: "" }],
    achievements: "",
};
const analyzeResume = (resumeData) => {
    const keywordCategories = {
        technical: [
            "Selenium", "Appium", "WebDriverIO", "Cypress", "Playwright", "Robot Framework",
            "Postman", "SoapUI", "REST Assured", "Karate", "Pact", "JMeter", "LoadRunner",
            "Gatling", "NeoLoad", "k6", "Burp Suite", "OWASP", "SonarQube",
            "MySQL", "MongoDB", "PostgreSQL", "Oracle", "SQL",
            "Python", "Java", "JavaScript", "C#", "Ruby", "Shell Scripting",
            "Jenkins", "GitHub Actions", "GitLab CI/CD", "CircleCI", "Travis CI",
            "AWS", "Azure", "Google Cloud", "Lambda", "S3", "Kubernetes", "Docker"
        ],
        tools: [
            "JIRA", "TestRail", "qTest", "ALM", "Zephyr", "Bugzilla",
            "TestNG", "JUnit", "PyTest", "Mocha", "Cucumber", "SpecFlow", "NUnit",
            "Espresso", "XCUITest", "Perfecto", "TestComplete",
            "Git", "GitHub", "Bitbucket", "SVN"
        ],
        softSkills: [
            "Agile", "Scrum", "Kanban", "Communication", "Leadership",
            "Problem-Solving", "Critical Thinking", "Team Collaboration"
        ],
    };

    let totalScore = 0;
    let keywordFrequency = {};
    let missingSections = [];
    const suggestions = [];
    const categoryScores = [];
    const resumeText = JSON.stringify(resumeData).toLowerCase();

    // **Keyword Analysis**
    Object.entries(keywordCategories).forEach(([category, keywords]) => {
        let categoryScore = 0;
        let foundKeywords = 0;

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "g");
            const matches = resumeText.match(regex);
            const count = matches ? matches.length : 0;

            keywordFrequency[keyword] = count;

            if (count > 0) {
                foundKeywords++;
                categoryScore += (count * 100) / keywords.length;
            }
        });

        categoryScores.push({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            score: categoryScore.toFixed(1),
            foundKeywords,
            missingKeywords: keywords.length - foundKeywords,
            suggestions: foundKeywords < keywords.length * 0.5 ? [`Consider adding more ${category} keywords.`] : [],
        });

        totalScore += categoryScore / Object.keys(keywordCategories).length;
    });

    // **Section Completeness Check**
    if (!resumeData.summary) missingSections.push("Professional Summary");
    if (!resumeData.experience || resumeData.experience.length < 1) missingSections.push("Work Experience");
    if (!resumeData.projects || resumeData.projects.length < 1) missingSections.push("Projects");
    if (!resumeData.education) missingSections.push("Education");
    if (!resumeData.skills || resumeData.skills.length < 3) missingSections.push("Skills Section");

    // **Scoring & Recommendations**
    if (missingSections.length > 0) {
        suggestions.push(`Your resume is missing important sections: ${missingSections.join(", ")}.`);
    }

    if (resumeData.summary && resumeData.summary.length < 150) {
        suggestions.push("Consider expanding your professional summary for better impact.");
    }

    // **Readability Score (Flesch-Kincaid Formula)**
    const words = resumeText.split(/\s+/).length;
    const sentences = resumeText.split(/[.!?]+/).length;
    const syllables = resumeText.split(/[aeiouy]{1,2}/).length;
    const readabilityScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));

    return {
        totalScore: totalScore.toFixed(1),
        readability: readabilityScore.toFixed(1),
        suggestions,
        missingSections,
        categoryScores,
        keywordFrequency,
    };
};


const ResumeGenerator = () => {
    const { currentUser } = useAuth();
    const [resumeData, setResumeData] = useState(initialResumeData);
    const [currentStep, setCurrentStep] = useState(0);
    const [atsResult, setAtsResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState('professional');
    const [previewScale, setPreviewScale] = useState(0.9);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [layout, setLayout] = useState("single-column");
    const [theme, setTheme] = useState("light");
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // idle, saving, saved, error
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [styledPdf, setStyledPdf] = useState(true);
    const [dynamicAtsFriendly, setDynamicAtsFriendly] = useState(true);

    const [sections, setSections] = useState([
        { id: "summary-1", label: "Professional Summary", enabled: true },
        { id: "experience-2", label: "Experience", enabled: true },
        { id: "education-3", label: "Education", enabled: true },
        { id: "skills-4", label: "Skills", enabled: true },
        { id: "certifications-5", label: "Certifications", enabled: true },
        { id: "projects-6", label: "Projects", enabled: true },
        { id: "achievements-7", label: "Achievements", enabled: true },
    ]);

    const templates = {
        professional: {
            name: 'Professional',
            colors: ['#2c3e50', '#2980b9'],
            style: 'classic'
        },
        modern: {
            name: 'Modern',
            colors: ['#27ae60', '#2ecc71'],
            style: 'clean'
        },
        creative: {
            name: 'Creative',
            colors: ['#e74c3c', '#e67e22'],
            style: 'bold'
        },
        executive: {
            name: 'Executive',
            colors: ['#34495e', '#9b59b6'],
            style: 'elegant'
        },
        minimalist: {
            name: 'Minimalist',
            colors: ['#7f8c8d', '#bdc3c7'],
            style: 'simple'
        },
        tech: {
            name: 'Tech',
            colors: ['#3498db', '#2c3e50'],
            style: 'technical'
        },
        academic: {
            name: 'Academic',
            colors: ['#8e44ad', '#3498db'],
            style: 'formal'
        },
        startup: {
            name: 'Startup',
            colors: ['#e74c3c', '#f39c12'],
            style: 'innovative'
        }
    };

    const themes = {
        light: {
            background: "#ffffff",
            text: "#000000",
            primary: "#2c3e50",
            secondary: "#2980b9"
        },
        dark: {
            background: "#2c3e50",
            text: "#ffffff",
            primary: "#2980b9",
            secondary: "#2ecc71"
        },
        colorful: {
            background: "#f0f0f0",
            text: "#333333",
            primary: "#e74c3c",
            secondary: "#e67e22"
        },
        professional: {
            background: "#f8f9fa",
            text: "#495057",
            primary: "#343a40",
            secondary: "#6c757d"
        },
        pastel: {
            background: "#f8f9fa",
            text: "#495057",
            primary: "#a5d8ff",
            secondary: "#ffd6a5"
        },
        highContrast: {
            background: "#000000",
            text: "#ffffff",
            primary: "#ffff00",
            secondary: "#ff00ff"
        }
    };

    const steps = ["Personal Info", "Experience", "Education", "Skills & Certifications", "Projects", "Achievements", "Preview"];

    const resumeContentRef = useRef(null);

    // Calculate completion percentage
    useEffect(() => {
        let filledFields = 0;
        let totalFields = 0;

        // Basic info
        totalFields += 3;
        if (resumeData.name) filledFields++;
        if (resumeData.email) filledFields++;
        if (resumeData.phone) filledFields++;

        // Summary
        totalFields++;
        if (resumeData.summary) filledFields++;

        // Experience
        resumeData.experience.forEach(exp => {
            totalFields += 4;
            if (exp.company) filledFields++;
            if (exp.position) filledFields++;
            if (exp.duration) filledFields++;
            if (exp.responsibilities) filledFields++;
        });

        // Education
        resumeData.education.forEach(edu => {
            totalFields += 4;
            if (edu.institution) filledFields++;
            if (edu.degree) filledFields++;
            if (edu.duration) filledFields++;
            if (edu.honors) filledFields++;
        });

        // Skills
        totalFields++;
        if (resumeData.skills.length > 0) filledFields++;

        // Certifications
        totalFields++;
        if (resumeData.certifications.length > 0) filledFields++;

        // Projects
        resumeData.projects.forEach(proj => {
            totalFields += 3;
            if (proj.title) filledFields++;
            if (proj.description) filledFields++;
            if (proj.technologies) filledFields++;
        });

        // Achievements
        totalFields++;
        if (resumeData.achievements) filledFields++;

        setCompletionPercentage(Math.round((filledFields / totalFields) * 100));
    }, [resumeData]);

    // Debounced ATS Analysis
    const debouncedAnalysis = useCallback(
        debounce((data) => {
            setAtsResult(analyzeResume(data));
        }, 500),
        []
    );

    useEffect(() => {
        debouncedAnalysis(resumeData);
    }, [resumeData, debouncedAnalysis]);

    useEffect(() => {
        if (currentUser) {
            setResumeData(prev => ({
                ...prev,
                name: currentUser.displayName || "",
                email: currentUser.email || "",
                phone: currentUser.phoneNumber || "",
            }));
        }
    }, [currentUser]);

    const handleInputChange = (field, value) => {
        setResumeData(prevData => ({ ...prevData, [field]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [field]: "" }));
        setAutoSaveStatus("saving");
        setTimeout(() => setAutoSaveStatus("saved"), 1000);
    };

    const handleArrayChange = (field, index, subField, value) => {
        setResumeData((prevData) => {
            const updatedArray = [...prevData[field]];
            updatedArray[index] = { ...updatedArray[index], [subField]: value };
            return { ...prevData, [field]: updatedArray };
        });
        setErrors(prevErrors => ({ ...prevErrors, [`${field}-${index}-${subField}`]: undefined }));
        setAutoSaveStatus("saving");
        setTimeout(() => setAutoSaveStatus("saved"), 1000);
    };

    const handleAddSection = (field, initialValue) => {
        setResumeData(prevData => ({
            ...prevData,
            [field]: [...prevData[field], initialValue]
        }));
        setAutoSaveStatus("saving");
        setTimeout(() => setAutoSaveStatus("saved"), 1000);
    };

    const handleRemoveSection = (field, index) => {
        setResumeData(prevData => ({
            ...prevData,
            [field]: prevData[field].filter((_, i) => i !== index)
        }));
        setAutoSaveStatus("saving");
        setTimeout(() => setAutoSaveStatus("saved"), 1000);
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 0:
                if (!resumeData.name.trim()) newErrors.name = "Name is required";
                if (!resumeData.email.trim()) newErrors.email = "Email is required";
                if (!resumeData.phone.trim()) newErrors.phone = "Phone is required";
                break;
            case 1:
                resumeData.experience.forEach((exp, index) => {
                    if (!exp.company.trim()) newErrors[`experience-${index}-company`] = "Company is required";
                    if (!exp.position.trim()) newErrors[`experience-${index}-position`] = "Position is required";
                });
                break;
            case 2:
                resumeData.education.forEach((edu, index) => {
                    if (!edu.institution.trim()) newErrors[`education-${index}-institution`] = "Institution is required";
                    if (!edu.degree.trim()) newErrors[`education-${index}-degree`] = "Degree is required";
                });
                break;
            case 4:
                resumeData.projects.forEach((proj, index) => {
                    if (!proj.title.trim()) newErrors[`projects-${index}-title`] = "Title is required";
                    if (!proj.description.trim()) newErrors[`projects-${index}-description`] = "Description is required";
                });
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStepChange = (direction) => {
        if (direction === "next" && !validateStep(currentStep)) return;
        setCurrentStep(prev => direction === "next" ? prev + 1 : prev - 1);
    };

    const handleGeneratePDF = async () => {
        setIsGeneratingPDF(true);

        try {
            const input = document.getElementById("resume-content");
            if (!input) {
                console.error("Resume content element not found!");
                return;
            }

            // Create a clone with proper dimensions
            const clone = input.cloneNode(true);
            clone.style.width = "210mm";
            clone.style.minHeight = "297mm";
            clone.style.position = "absolute";
            clone.style.left = "-9999px";
            clone.style.top = "0";
            clone.style.transform = "none";
            clone.style.backgroundColor = themes[theme].background;
            document.body.appendChild(clone);

            // Apply ATS-friendly formatting if enabled
            if (dynamicAtsFriendly) {
                // Add structured headers and bullet points
                const headers = clone.querySelectorAll("h2, h3");
                headers.forEach(header => {
                    header.style.fontWeight = "bold";
                    header.style.marginBottom = "8px";
                });

                // Convert responsibilities to bullet points
                const responsibilities = clone.querySelectorAll(".responsibilities");
                responsibilities.forEach(resp => {
                    const text = resp.textContent;
                    resp.innerHTML = text.split("\n").filter(t => t.trim()).map(t => `• ${t.trim()}`).join("<br>");
                });
            }

            // Wait for all fonts and images to load
            await Promise.all([
                document.fonts.ready,
                ...Array.from(clone.querySelectorAll("img")).map(img =>
                    img.complete ? Promise.resolve() : new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                )
            ]);

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                hotfixes: ["px_scaling"]
            });

            // Apply styling options if enabled
            if (styledPdf) {
                // Add custom styling for branded PDF
                clone.style.fontFamily = "'Arial', sans-serif";
                clone.style.color = "#333";
                clone.querySelectorAll(".section-title").forEach(title => {
                    title.style.color = templates[activeTemplate].colors[0];
                    title.style.borderBottom = `2px solid ${templates[activeTemplate].colors[1]}`;
                    title.style.paddingBottom = "4px";
                });
            }

            const scale = 2;
            const margin = 0; // mm margin on all sides
            const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
            const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;

            const canvas = await html2canvas(clone, {
                scale,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: themes[theme].background,
                onclone: (clonedDoc) => {
                    clonedDoc.getElementById("resume-content").style.boxShadow = "none";
                }
            });

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            let pageNumber = 1;

            while (position < imgHeight) {
                if (pageNumber > 1) pdf.addPage();

                const sectionHeight = Math.min(pageHeight, imgHeight - position);

                pdf.addImage(
                    canvas.toDataURL("image/png"),
                    "PNG",
                    margin,
                    margin,
                    imgWidth,
                    sectionHeight,
                    undefined,
                    "FAST"
                );

                position += pageHeight;
                pageNumber++;
            }

            // Generate filename
            const fileName = resumeData.name
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^\w-]/g, '') || 'Resume';

            pdf.save(`${fileName}.pdf`);
            document.body.removeChild(clone);
        } catch (error) {
            console.error("PDF generation failed:", error);
            setAutoSaveStatus("error");
            setTimeout(() => setAutoSaveStatus("idle"), 3000);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
    };

    const handleTemplateChange = (template) => {
        setActiveTemplate(template);
        document.documentElement.style.setProperty('--primary-color', templates[template].colors[0]);
        document.documentElement.style.setProperty('--secondary-color', templates[template].colors[1]);
    };

    const renderSectionContent = (section) => {
        switch(section.id) {
            case 'summary-1':
                return resumeData.summary && (
                    <section className="resume-section mb-4" style={{ marginTop: "20px" }}>
                        <h2 className="section-title"><FaUser className="me-2" />Professional Summary</h2>
                        <Card className="p-3 bg-light">
                            <p className="mb-0">{resumeData.summary}</p>
                        </Card>
                    </section>
                );
            case 'experience-2':
                return resumeData.experience.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaBriefcase className="me-2" />Experience</h2>
                        {resumeData.experience.map((exp, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <h3 className="mb-1">{exp.position} - {exp.company}</h3>
                                    <p className="text-muted mb-2">{exp.duration}</p>
                                    <p className="mb-0 responsibilities">{exp.responsibilities}</p>
                                </Card.Body>
                            </Card>
                        ))}
                    </section>
                );
            case 'education-3':
                return resumeData.education.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaGraduationCap className="me-2" />Education</h2>
                        {resumeData.education.map((edu, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <h3 className="mb-1">{edu.degree} - {edu.institution}</h3>
                                    <p className="text-muted mb-2">{edu.duration}</p>
                                    {edu.honors && <p className="mb-0"><strong>Honors:</strong> {edu.honors}</p>}
                                </Card.Body>
                            </Card>
                        ))}
                    </section>
                );
            case 'skills-4':
                return resumeData.skills.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaCode className="me-2" />Skills</h2>
                        <Card className="p-3 bg-light">
                            <div className="d-flex flex-wrap gap-2">
                                {resumeData.skills.map((skill, index) => (
                                    <span key={index} className="badge bg-primary">{skill}</span>
                                ))}
                            </div>
                        </Card>
                    </section>
                );
            case 'certifications-5':
                return resumeData.certifications.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaAward className="me-2" />Certifications</h2>
                        <Card className="p-3 bg-light">
                            <ul className="mb-0">
                                {resumeData.certifications.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </Card>
                    </section>
                );
            case 'projects-6':
                return resumeData.projects.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaCode className="me-2" />Projects</h2>
                        {resumeData.projects.map((proj, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <h3 className="mb-1">{proj.title}</h3>
                                    <p className="text-muted mb-2">{proj.technologies}</p>
                                    <p className="mb-0">{proj.description}</p>
                                </Card.Body>
                            </Card>
                        ))}
                    </section>
                );
            case 'achievements-7':
                return resumeData.achievements && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaAward className="me-2" />Achievements</h2>
                        <Card className="p-3 bg-light">
                            <p className="mb-0">{resumeData.achievements}</p>
                        </Card>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <Container fluid className={`resume-generator-container ${darkMode ? 'dark-mode' : ''}`}>
            {/* Status Bar */}
            <div className="status-bar">
                <div className="completion-status">
                    <span>Completion: {completionPercentage}%</span>
                    <ProgressBar now={completionPercentage} className="ms-2" style={{ width: '150px' }} />
                </div>
                <div className="auto-save-status">
                    {autoSaveStatus === "saving" && (
                        <span className="text-muted">Saving...</span>
                    )}
                    {autoSaveStatus === "saved" && (
                        <span className="text-success"><FaCheck /> Saved</span>
                    )}
                    {autoSaveStatus === "error" && (
                        <span className="text-danger"><FaExclamationTriangle /> Error saving</span>
                    )}
                </div>
            </div>

            {/* Floating Controls */}
            <div className="floating-controls">
                <div className="template-preview">
                    <span className="template-name">{templates[activeTemplate].name}</span>
                    <div className="template-colors">
                        <span
                            className="color-dot"
                            style={{ backgroundColor: templates[activeTemplate].colors[0] }}
                        />
                        <span
                            className="color-dot"
                            style={{ backgroundColor: templates[activeTemplate].colors[1] }}
                        />
                    </div>
                </div>
                <div className="template-selector" style={{
                    marginTop: "60px",
                    marginRight: "-260px",
                }}>
                    {Object.entries(templates).map(([key, template]) => (
                        <motion.div
                            key={key}
                            className={`template-dot ${activeTemplate === key ? 'active' : ''}`}
                            style={{
                                backgroundColor: template.colors[0],
                                border: `2px solid ${template.colors[1]}`
                            }}
                            onClick={() => handleTemplateChange(key)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={template.name}
                        />
                    ))}
                </div>
                <div className="quick-actions">
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip>Toggle Styled PDF</Tooltip>}
                    >
                        <Button
                            variant={styledPdf ? "primary" : "outline-secondary"}
                            size="sm"
                            onClick={() => setStyledPdf(!styledPdf)}
                        >
                            <FaPalette />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip>Toggle ATS Optimization</Tooltip>}
                    >
                        <Button
                            variant={dynamicAtsFriendly ? "primary" : "outline-secondary"}
                            size="sm"
                            onClick={() => setDynamicAtsFriendly(!dynamicAtsFriendly)}
                            className="ms-2"
                        >
                            <FaMagic />
                        </Button>
                    </OverlayTrigger>
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowSettings(true)} className="ms-2">
                        <FaCog /> Settings
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowHelp(true)} className="ms-2">
                        <FaQuestionCircle /> Help
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <Row className="g-4">
                <Col lg={3} className="sidebar">
                    <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
                        <div className="steps-container p-3">
                            <h3 className="mb-4 d-flex align-items-center">
                                <FaEdit className="me-2" />
                                Resume Builder
                                <span className="ms-auto badge bg-primary">
                                    {currentStep + 1}/{steps.length}
                                </span>
                            </h3>
                            <ListGroup variant="flush">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ListGroup.Item
                                            active={index === currentStep}
                                            onClick={() => setCurrentStep(index)}
                                            action
                                            className="d-flex align-items-center"
                                        >
                                            <span className="step-badge me-2">{index + 1}</span>
                                            {step}
                                            {index === currentStep && (
                                                <motion.span
                                                    className="ms-auto"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring" }}
                                                >
                                                    ➔
                                                </motion.span>
                                            )}
                                        </ListGroup.Item>
                                    </motion.div>
                                ))}
                            </ListGroup>
                        </div>
                    </motion.div>
                </Col>

                <Col lg={9} className="main-content">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 1, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step Content */}
                            {currentStep === 0 && (
                                <Card className="p-4 hover-shadow">
                                    <h4 className="mb-4"><FaUser className="me-2" />Personal Information</h4>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <FloatingLabel controlId="name" label="Full Name" className="mb-3">
                                                <Form.Control
                                                    value={resumeData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    isInvalid={!!errors.name}
                                                    className="input-glass"
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md={6}>
                                            <FloatingLabel controlId="email" label="Email" className="mb-3">
                                                <Form.Control
                                                    type="email"
                                                    value={resumeData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    isInvalid={!!errors.email}
                                                    className="input-glass"
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md={6}>
                                            <FloatingLabel controlId="phone" label="Phone" className="mb-3">
                                                <Form.Control
                                                    type="tel"
                                                    value={resumeData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    isInvalid={!!errors.phone}
                                                    className="input-glass"
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md={12}>
                                            <FloatingLabel controlId="summary" label="Professional Summary">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    value={resumeData.summary}
                                                    onChange={(e) => handleInputChange('summary', e.target.value)}
                                                    className="input-glass"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Card>
                            )}

                            {/* Step 1: Experience */}
                            {currentStep === 1 && (
                                <Card className="p-4 hover-shadow">
                                    <h4 className="mb-4"><FaBriefcase className="me-2" />Experience</h4>
                                    {resumeData.experience.map((exp, index) => (
                                        <div key={index} className="experience-item mb-4 p-3 border rounded">
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`experience-company-${index}`} label="Company">
                                                        <Form.Control
                                                            value={exp.company}
                                                            onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                                            isInvalid={!!errors[`experience-${index}-company`]}
                                                            className="input-glass"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`experience-${index}-company`]}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`experience-position-${index}`} label="Position">
                                                        <Form.Control
                                                            value={exp.position}
                                                            onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                                                            isInvalid={!!errors[`experience-${index}-position`]}
                                                            className="input-glass"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`experience-${index}-position`]}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`experience-duration-${index}`} label="Duration">
                                                        <Form.Control
                                                            value={exp.duration}
                                                            onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                                                            className="input-glass"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={12}>
                                                    <FloatingLabel controlId={`experience-responsibilities-${index}`} label="Responsibilities">
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            value={exp.responsibilities}
                                                            onChange={(e) => handleArrayChange('experience', index, 'responsibilities', e.target.value)}
                                                            className="input-glass"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col className="text-end">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveSection('experience', index)}
                                                    >
                                                        <FaTrash /> Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleAddSection('experience', { company: "", position: "", duration: "", responsibilities: "" })}
                                    >
                                        <FaPlus /> Add Experience
                                    </Button>
                                </Card>
                            )}

                            {/* Step 2: Education */}
                            {currentStep === 2 && (
                                <Card className="p-4 hover-shadow">
                                    <h4 className="mb-4"><FaGraduationCap className="me-2" />Education</h4>
                                    {resumeData.education.map((edu, index) => (
                                        <div key={index} className="education-item mb-4 p-3 border rounded">
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`education-institution-${index}`} label="Institution">
                                                        <Form.Control
                                                            value={edu.institution}
                                                            onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                                            isInvalid={!!errors[`education-${index}-institution`]}
                                                            className="input-glass"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`education-${index}-institution`]}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`education-degree-${index}`} label="Degree">
                                                        <Form.Control
                                                            value={edu.degree}
                                                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                                            isInvalid={!!errors[`education-${index}-degree`]}
                                                            className="input-glass"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`education-${index}-degree`]}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`education-duration-${index}`} label="Duration">
                                                        <Form.Control
                                                            value={edu.duration}
                                                            onChange={(e) => handleArrayChange('education', index, 'duration', e.target.value)}
                                                            className="input-glass"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`education-honors-${index}`} label="Honors/Awards">
                                                        <Form.Control
                                                            value={edu.honors}
                                                            onChange={(e) => handleArrayChange('education', index, 'honors', e.target.value)}
                                                            className="input-glass"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col className="text-end">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveSection('education', index)}
                                                    >
                                                        <FaTrash /> Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleAddSection('education', { institution: "", degree: "", duration: "", honors: "" })}
                                    >
                                        <FaPlus /> Add Education
                                    </Button>
                                </Card>
                            )}

                            {/* Step 3: Skills & Certifications */}
                            {currentStep === 3 && (
                                <Card className="p-4 hover-shadow">
                                    <h4 className="mb-4"><FaCode className="me-2" />Skills & Certifications</h4>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <FloatingLabel controlId="skills" label="Skills (comma separated)">
                                                <Form.Control
                                                    value={resumeData.skills.join(", ")}
                                                    onChange={(e) => handleInputChange('skills', e.target.value.split(",").map(s => s.trim()))}
                                                    className="input-glass"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col md={6}>
                                            <FloatingLabel controlId="certifications" label="Certifications (comma separated)">
                                                <Form.Control
                                                    value={resumeData.certifications.join(", ")}
                                                    onChange={(e) => handleInputChange('certifications', e.target.value.split(",").map(c => c.trim()))}
                                                    className="input-glass"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Card>
                            )}

                            {/* Step 4: Projects */}
                            {currentStep === 4 && (
                                <Card className="p-4 hover-shadow">
                                    <h4 className="mb-4"><FaCode className="me-2" />Projects</h4>
                                    {resumeData.projects.map((proj, index) => (
                                        <div key={index} className="project-item mb-4 p-3 border rounded">
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`project-title-${index}`} label="Title">
                                                        <Form.Control
                                                            value={proj.title}
                                                            onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                                                            isInvalid={!!errors[`projects-${index}-title`]}
                                                            className="input-glass"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`projects-${index}-title`]}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={6}>
                                                    <FloatingLabel controlId={`project-technologies-${index}`} label="Technologies">
                                                        <Form.Control
                                                            value={proj.technologies}
                                                            onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                                                            className="input-glass"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col md={12}>
                                                    <FloatingLabel controlId={`project-description-${index}`} label="Description">
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            value={proj.description}
                                                            onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                                            isInvalid={!!errors[`projects-${index}-description`]}
                                                            className="input-glass"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors[`projects-${index}-description`]}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col className="text-end">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveSection('projects', index)}
                                                    >
                                                        <FaTrash /> Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleAddSection('projects', { title: "", description: "", technologies: "" })}
                                    >
                                        <FaPlus /> Add Project
                                    </Button>
                                </Card>
                            )}

                            {/* Step 5: Achievements */}
                            {currentStep === 5 && (
                                <Card className="p-4 hover-shadow">
                                    <h4 className="mb-4"><FaAward className="me-2" />Achievements</h4>
                                    <FloatingLabel controlId="achievements" label="Achievements">
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={resumeData.achievements}
                                            onChange={(e) => handleInputChange('achievements', e.target.value)}
                                            className="input-glass"
                                        />
                                    </FloatingLabel>
                                </Card>
                            )}

                            {/* Step 6: Preview */}
                            {currentStep === steps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="preview-container" style={{ marginRight: 140 }}>
                                        <div className="preview-controls">
                                            <ButtonGroup size="sm">
                                                <Button variant="outline-secondary" onClick={() => setPreviewScale(Math.max(0.7, previewScale - 0.1))}>
                                                    -
                                                </Button>
                                                <Button variant="outline-secondary" onClick={() => setPreviewScale(Math.min(1.2, previewScale + 0.1))}>
                                                    +
                                                </Button>
                                            </ButtonGroup>
                                            <span className="scale-percentage">{Math.round(previewScale * 100)}%</span>

                                            <ButtonGroup className="ms-3">
                                                <Button
                                                    variant={layout === "single-column" ? "primary" : "outline-secondary"}
                                                    onClick={() => setLayout("single-column")}
                                                    title="Single Column Layout"
                                                >
                                                    <FaColumns /> Single
                                                </Button>
                                                <Button
                                                    variant={layout === "two-column" ? "primary" : "outline-secondary"}
                                                    onClick={() => setLayout("two-column")}
                                                    title="Two Column Layout"
                                                >
                                                    <FaColumns /> Double
                                                </Button>
                                            </ButtonGroup>

                                            <ButtonGroup className="ms-3">
                                                {Object.keys(themes).map((key) => (
                                                    <Button
                                                        key={key}
                                                        variant={theme === key ? "primary" : "outline-secondary"}
                                                        onClick={() => setTheme(key)}
                                                        title={`${key.charAt(0).toUpperCase() + key.slice(1)} Theme`}
                                                    >
                                                        <FaPalette /> {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </Button>
                                                ))}
                                            </ButtonGroup>
                                        </div>

                                        <motion.div
                                            className={`resume-template ${layout} ${templates[activeTemplate].style}`}
                                            id="resume-content"
                                            style={{
                                                transform: `scale(${previewScale})`,
                                                backgroundColor: themes[theme].background,
                                                color: themes[theme].text,
                                            }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                        >
                                            {/* Resume Preview Content */}
                                            <header className="resume-header text-center mb-4" style={{ marginRight: 130 }}>
                                                <h1 className="name-gradient">{resumeData.name}</h1>
                                                <div className="contact-badges d-flex justify-content-center gap-3">
                                                    {resumeData.email && (
                                                        <motion.div className="contact-badge" whileHover={{ y: -2 }}>
                                                            <FaEnvelope /> {resumeData.email}
                                                        </motion.div>
                                                    )}
                                                    {resumeData.phone && (
                                                        <motion.div className="contact-badge" whileHover={{ y: -2 }}>
                                                            <FaPhone /> {resumeData.phone}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </header>

                                            {/* Drag-and-Drop Sections */}
                                            <DragDropContext onDragEnd={onDragEnd}>
                                                <Droppable
                                                    droppableId="resume-sections"
                                                    isDropDisabled={false}
                                                    ignoreContainerClipping={false}
                                                    direction="vertical"
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                                minHeight: '100px',
                                                                backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.1)' : 'transparent'
                                                            }}
                                                        >
                                                            {sections.map((section, index) => (
                                                                <Draggable
                                                                    key={section.id}
                                                                    draggableId={section.id}
                                                                    index={index}
                                                                >
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                ...provided.draggableProps.style,
                                                                                marginBottom: '16px'
                                                                            }}
                                                                        >
                                                                            {renderSectionContent(section)}
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="navigation-buttons mt-4">
                        {currentStep > 0 && (
                            <Button variant="secondary" onClick={() => handleStepChange("prev")}>
                                Previous
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button variant="primary" className="ms-2" onClick={() => handleStepChange("next")}>
                                Next
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button variant="success" className="ms-2" onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
                                {isGeneratingPDF ? "Generating..." : <><FaDownload /> Download PDF</>}
                            </Button>
                        )}
                    </div>

                    {/* ATS Dashboard */}
                    {atsResult && (
                        <motion.div
                            className="ats-dashboard mt-4"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                        >
                            <h4><FaChartBar className="me-2" />ATS Optimization Dashboard</h4>
                            <div className="radial-progress-container">
                                {atsResult.categoryScores.map((cat, index) => (
                                    <div key={index} className="radial-progress">
                                        <CircularProgressbar
                                            value={cat.score}
                                            text={`${cat.score}%`}
                                            styles={{
                                                path: { stroke: `rgba(41, 128, 185, ${0.8 - index * 0.2})` },
                                                text: { fill: darkMode ? '#fff' : '#2c3e50' }
                                            }}
                                        />
                                        <div className="radial-label">{cat.name}</div>
                                    </div>
                                ))}
                            </div>
                            {atsResult.suggestions.length > 0 && (
                                <Alert variant="warning" className="mt-3">
                                    <h5><FaExclamationTriangle className="me-2" />Improvement Suggestions</h5>
                                    <ul className="mb-0">
                                        {atsResult.suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}
                        </motion.div>
                    )}
                </Col>
            </Row>

            {/* Settings Modal */}
            <Modal show={showSettings} onHide={() => setShowSettings(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FaCog /> Resume Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Dark Mode</Form.Label>
                            <div>
                                <ReactSwitch
                                    checked={darkMode}
                                    onChange={() => setDarkMode(!darkMode)}
                                    onColor="#2c3e50"
                                    offColor="#adb5bd"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Default Template</Form.Label>
                            <Form.Select
                                value={activeTemplate}
                                onChange={(e) => handleTemplateChange(e.target.value)}
                            >
                                {Object.entries(templates).map(([key, template]) => (
                                    <option key={key} value={key}>{template.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Default Theme</Form.Label>
                            <Form.Select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            >
                                {Object.keys(themes).map(key => (
                                    <option key={key} value={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center">
                                <FaPalette className="me-2" /> Styled, Branded PDF Template
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <ReactSwitch
                                    checked={styledPdf}
                                    onChange={() => setStyledPdf(!styledPdf)}
                                    onColor="#2c3e50"
                                    offColor="#adb5bd"
                                />
                                <span className="ms-3">
                                    {styledPdf ? "Enabled" : "Disabled"} - We can apply custom fonts, colors, and layouts for a polished look
                                </span>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center">
                                <FaMagic className="me-2" /> Dynamic & ATS-Friendly
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <ReactSwitch
                                    checked={dynamicAtsFriendly}
                                    onChange={() => setDynamicAtsFriendly(!dynamicAtsFriendly)}
                                    onColor="#2c3e50"
                                    offColor="#adb5bd"
                                />
                                <span className="ms-3">
                                    {dynamicAtsFriendly ? "Enabled" : "Disabled"} - Ensuring structured headers, bullet points, and proper keyword placement
                                </span>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSettings(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setShowSettings(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Help Modal */}
            <Modal show={showHelp} onHide={() => setShowHelp(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title><FaQuestionCircle /> Resume Builder Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Getting Started</h5>
                    <p>
                        Follow the steps on the left to build your resume. Each section corresponds to a part of your resume.
                        Fill in all the required fields to create a complete resume.
                    </p>

                    <h5 className="mt-4">Tips for a Strong Resume</h5>
                    <ul>
                        <li>Use action verbs to describe your experience (e.g., "Developed", "Managed", "Led")</li>
                        <li>Quantify achievements when possible (e.g., "Increased sales by 20%")</li>
                        <li>Keep your professional summary concise and focused</li>
                        <li>Tailor your resume to the job you're applying for</li>
                    </ul>

                    <h5 className="mt-4">ATS Optimization</h5>
                    <p>
                        The ATS (Applicant Tracking System) dashboard shows how well your resume matches common job requirements.
                        Aim for high scores in all categories for the best results.
                    </p>

                    <h5 className="mt-4">PDF Options</h5>
                    <ul>
                        <li><strong>Styled PDF:</strong> Applies your selected template's colors and custom styling to the PDF</li>
                        <li><strong>ATS-Friendly:</strong> Ensures proper structure, bullet points, and formatting that applicant tracking systems prefer</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHelp(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ResumeGenerator;