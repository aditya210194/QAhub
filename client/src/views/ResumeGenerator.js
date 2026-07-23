// client/src/pages/ResumeGenerator.js
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import {
    Container, Button, Form, Row, Col, Card, ListGroup, OverlayTrigger,
    Tooltip, FloatingLabel, ButtonGroup, ProgressBar, Modal, Alert, Badge
} from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import {
    FaPlus, FaChartBar, FaUser, FaEnvelope, FaPhone,
    FaMagic, FaEdit, FaBriefcase, FaGraduationCap, FaCode,
    FaAward, FaTrash, FaDownload, FaCog, FaEye, FaPalette,
    FaColumns, FaQuestionCircle, FaCheck, FaExclamationTriangle,
    FaSave, FaFilePdf, FaArrowLeft, FaArrowRight, FaGripVertical,
    FaUpload, FaSpinner, FaTimes, FaLinkedin, FaGithub, FaMapMarker
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactSwitch from "react-switch";
import { debounce } from "lodash";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as pdfjsLib from 'pdfjs-dist';
import "./ResumeGenerator.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ResumeTemplates, { TemplateSelector } from "../components/ResumeTemplates";


// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Key used to hand an uploaded resume off from the Resumes page to this one.
// Next.js's App Router has no React-Router-style location.state, so the raw
// file is base64-encoded into sessionStorage instead (see Resumes.js).
const UPLOAD_STORAGE_KEY = 'qahub_uploaded_resume';

// ==================== CONSTANTS & CONFIG ====================
const KEYWORD_CATEGORIES = {
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

const INITIAL_RESUME_DATA = {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    title: "",
    summary: "",
    experience: [{ company: "", position: "", duration: "", responsibilities: "" }],
    education: [{ institution: "", degree: "", duration: "", honors: "" }],
    skills: [],
    certifications: [],
    projects: [{ title: "", description: "", technologies: "" }],
    achievements: "",
};

const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Projects", "Achievements", "Preview"];

const INITIAL_SECTIONS = [
    { id: "summary-1", label: "Professional Summary", enabled: true },
    { id: "experience-2", label: "Experience", enabled: true },
    { id: "education-3", label: "Education", enabled: true },
    { id: "skills-4", label: "Skills", enabled: true },
    { id: "certifications-5", label: "Certifications", enabled: true },
    { id: "projects-6", label: "Projects", enabled: true },
    { id: "achievements-7", label: "Achievements", enabled: true },
];

// ==================== UTILITY FUNCTIONS ====================
const extractTextFromPDF = async (arrayBuffer) => {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        let allItems = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageItems = textContent.items.map(item => ({
                text: item.str,
                x: item.transform[4],
                y: item.transform[5]
            }));

            pageItems.sort((a, b) => {
                if (Math.abs(a.y - b.y) < 10) return a.x - b.x;
                return b.y - a.y;
            });

            const pageText = pageItems.map(item => item.text).join(' ');
            allItems.push(...pageItems);
            fullText += pageText + '\n';
        }

        const lines = [];
        let currentLine = [];
        let currentY = null;

        for (const item of allItems) {
            if (currentY === null || Math.abs(item.y - currentY) > 10) {
                if (currentLine.length > 0) {
                    lines.push(currentLine.map(i => i.text).join(' '));
                }
                currentLine = [item];
                currentY = item.y;
            } else {
                currentLine.push(item);
            }
        }
        if (currentLine.length > 0) {
            lines.push(currentLine.map(i => i.text).join(' '));
        }

        return lines.join('\n');
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return '';
    }
};

// Extracts structured resume fields from raw PDF text. This is a best-effort,
// regex-based parser intended for the sample resume format bundled with the
// app — real-world resumes vary widely, so treat extracted fields as a
// starting point the user should review, not a guarantee.
const parseResumeText = (text) => {
    const extractedData = {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        title: "",
        summary: "",
        skills: [],
        certifications: [],
        experience: [],
        education: [],
        projects: [],
        achievements: ""
    };

    // 1. Name
    const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/m);
    if (nameMatch) extractedData.name = nameMatch[1];

    // 2. Title
    const titleMatch = text.match(/(?:Software|Senior|Lead)?\s*(QA|Quality Assurance|Software Test|Automation)\s*(Engineer|Analyst|Lead|Manager)/i);
    if (titleMatch) extractedData.title = titleMatch[0].trim();

    // 3. Email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) extractedData.email = emailMatch[0];

    // 4. Phone
    const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\d{10}/);
    if (phoneMatch) extractedData.phone = phoneMatch[0].trim();

    // 5. Location
    const locationMatch = text.match(/(?:Columbia|Boston|San Francisco|New York)[^,\n]*(?:SC|CA|NY|MA)/i);
    if (locationMatch) extractedData.location = locationMatch[0];

    // 6. LinkedIn & GitHub
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) extractedData.linkedin = `https://${linkedinMatch[0]}`;

    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) extractedData.github = `https://${githubMatch[0]}`;

    // 7. Summary
    const summaryMatch = text.match(/(?:Software QA engineer|QA engineer)[^.]*\.[^.]*\.[^.]*\./i);
    if (summaryMatch) extractedData.summary = summaryMatch[0].trim();

    // 8. Work experience
    const experienceSection = text.match(/WORK EXPERIENCE[\s\S]*?(?=EDUCATION|OTHER|CERTIFICATIONS|$)/i);

    if (experienceSection) {
        const expText = experienceSection[0];
        const jobBlocks = [];

        const jobPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Inc\.|LLC|Corp)?)/gi;
        let match;
        let lastIndex = 0;

        while ((match = jobPattern.exec(expText)) !== null) {
            if (lastIndex > 0) {
                const jobText = expText.substring(lastIndex, match.index);
                jobBlocks.push({
                    position: match[1],
                    company: match[2],
                    text: jobText
                });
            }
            lastIndex = match.index;
        }

        if (lastIndex > 0) {
            const jobText = expText.substring(lastIndex);
            jobBlocks.push({
                position: jobBlocks[jobBlocks.length - 1]?.position || "",
                company: jobBlocks[jobBlocks.length - 1]?.company || "",
                text: jobText
            });
        }

        if (jobBlocks.length === 0) {
            const lines = expText.split('\n');
            let currentJob = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:at|@)/i)) {
                    if (currentJob) {
                        jobBlocks.push(currentJob);
                    }
                    const titleMatch2 = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@)\s+(.+)/i);
                    currentJob = {
                        position: titleMatch2 ? titleMatch2[1] : "",
                        company: titleMatch2 ? titleMatch2[2] : "",
                        text: ""
                    };
                } else if (currentJob) {
                    currentJob.text += line + '\n';
                }
            }
            if (currentJob) {
                jobBlocks.push(currentJob);
            }
        }

        for (const job of jobBlocks) {
            if (!job.position && !job.company) continue;

            const durationMatch = job.text.match(/(\d{4})\s*[-–]\s*(?:\d{4}|Present|current)/i);
            const duration = durationMatch ? durationMatch[0] : "";

            const responsibilities = [];

            const bulletPattern = /[•\-*]\s*([^\n]+)/g;
            let bulletMatch;
            while ((bulletMatch = bulletPattern.exec(job.text)) !== null) {
                responsibilities.push(bulletMatch[1].trim());
            }

            const numberedPattern = /\d+\.\s*([^\n]+)/g;
            let numberedMatch;
            while ((numberedMatch = numberedPattern.exec(job.text)) !== null) {
                responsibilities.push(numberedMatch[1].trim());
            }

            const achievementPattern = /(?:achieved|increased|reduced|saved|improved|implemented|developed|led|created|designed)[^.!?]*[.!?]/gi;
            let achievementMatch;
            while ((achievementMatch = achievementPattern.exec(job.text)) !== null) {
                const achievement = achievementMatch[0].trim();
                if (achievement.length > 20 && !responsibilities.includes(achievement)) {
                    responsibilities.push(achievement);
                }
            }

            const cleanResponsibilities = responsibilities
                .filter(r => r.length > 10 && r.length < 300)
                .slice(0, 5);

            extractedData.experience.push({
                company: job.company.trim(),
                position: job.position.trim(),
                duration: duration,
                responsibilities: cleanResponsibilities.join('\n')
            });
        }
    }

    // Fallback parsing tuned for the sample resumes bundled with the app
    const specificJobs = [
        {
            pattern: /Software QA Engineer.*?Resume Worded[^\n]*\n([\s\S]*?)(?=\n\n[A-Z][a-z]|\nSoftware Business Analyst|\nDeveloper|\n$)/i,
            position: "Software QA Engineer",
            company: "Resume Worded"
        },
        {
            pattern: /Software Business Analyst.*?Growthsi[^\n]*\n([\s\S]*?)(?=\n\n[A-Z][a-z]|\nDeveloper|\n$)/i,
            position: "Software Business Analyst",
            company: "Growthsi"
        },
        {
            pattern: /Developer.*?Resume Worded's Exciting Company[^\n]*\n([\s\S]*?)(?=\n\n[A-Z][a-z]|\nEDUCATION|\nCONTACT|\n$)/i,
            position: "Developer",
            company: "Resume Worded's Exciting Company"
        }
    ];

    for (const job of specificJobs) {
        const match = text.match(job.pattern);
        if (match && !extractedData.experience.some(e => e.company === job.company)) {
            const responsibilities = [];
            const lines = match[1].split('\n');
            for (const line of lines) {
                const cleanLine = line.trim();
                if (cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
                    responsibilities.push(cleanLine.substring(1).trim());
                } else if (cleanLine.match(/^[A-Z][a-z]/) && cleanLine.length > 30) {
                    responsibilities.push(cleanLine);
                }
            }

            const durationMatch = match[1].match(/(\d{4})\s*[-–]\s*(?:\d{4}|Present)/i);

            extractedData.experience.push({
                company: job.company,
                position: job.position,
                duration: durationMatch ? durationMatch[0] : "",
                responsibilities: responsibilities.join('\n').substring(0, 500)
            });
        }
    }

    // 9. Skills
    const skillsSection = text.match(/SKILLS[\s\S]*?(?=EDUCATION|WORK EXPERIENCE|$)/i);
    if (skillsSection) {
        const skillsText = skillsSection[0];
        const skillLines = skillsText.match(/(?:Technical Skills|Industry Knowledge|Tools and Software)[:][^\n]+/gi);
        if (skillLines) {
            skillLines.forEach(line => {
                const skills = line.match(/(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
                if (skills) {
                    skills.forEach(skill => {
                        if (skill && skill.length > 1 && !extractedData.skills.includes(skill)) {
                            extractedData.skills.push(skill);
                        }
                    });
                }
            });
        }
    }
    extractedData.skills = [...new Set(extractedData.skills)];

    // 10. Certifications
    const certSection = text.match(/OTHER[:\s]*([\s\S]*?)(?=$|\n\n)/i);
    if (certSection) {
        const certs = certSection[1].match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Certification|Certificate|Engineer|Tester)/g);
        if (certs) {
            extractedData.certifications = [...new Set(certs)];
        }
    }

    // 11. Education
    const educationSection = text.match(/EDUCATION[\s\S]*?(?=OTHER|CERTIFICATIONS|$)/i);
    if (educationSection) {
        const eduText = educationSection[0];
        const degreeMatch = eduText.match(/(?:Bachelor|Master|B\.Sc|M\.Sc|B\.Tech|M\.Tech|PhD)[\s\w]+/i);
        const institutionMatch = eduText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|College))/i);
        const yearMatch = eduText.match(/(?:May|June|July|August|September|October|November|December)\s+\d{4}/i);

        if (degreeMatch || institutionMatch) {
            extractedData.education = [{
                institution: institutionMatch ? institutionMatch[1] : "",
                degree: degreeMatch ? degreeMatch[0] : "",
                duration: yearMatch ? yearMatch[0] : "",
                honors: ""
            }];
        }
    }

    // 12. Achievements
    const achievementPatterns = [
        /received an award for[^.]*\./i,
        /achieved a[^.]*%[^.]*\./i,
        /saved over[^.]*\./i,
        /recognized by[^.]*\./i,
        /key achievement[^.]*\./i,
        /resolved[^.]*\./i,
        /launched initiative[^.]*\./i,
        /conceived a project[^.]*\./i
    ];

    const achievements = [];
    achievementPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) achievements.push(match[0]);
    });

    if (achievements.length > 0) {
        extractedData.achievements = achievements.join('\n');
    }

    return extractedData;
};

const analyzeResume = (resumeData) => {
    let totalScore = 0;
    let keywordFrequency = {};
    let missingSections = [];
    const suggestions = [];
    const categoryScores = [];
    const resumeText = JSON.stringify(resumeData).toLowerCase();

    Object.entries(KEYWORD_CATEGORIES).forEach(([category, keywords]) => {
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
            score: Math.min(100, categoryScore.toFixed(1)),
            foundKeywords,
            missingKeywords: keywords.length - foundKeywords,
            suggestions: foundKeywords < keywords.length * 0.5 ? [`Consider adding more ${category} keywords.`] : [],
        });

        totalScore += categoryScore / Object.keys(KEYWORD_CATEGORIES).length;
    });

    if (!resumeData.summary) missingSections.push("Professional Summary");
    if (!resumeData.experience?.length || (resumeData.experience.length === 1 && !resumeData.experience[0].company)) missingSections.push("Work Experience");
    if (!resumeData.projects?.length || (resumeData.projects.length === 1 && !resumeData.projects[0].title)) missingSections.push("Projects");
    if (!resumeData.education?.length || (resumeData.education.length === 1 && !resumeData.education[0].institution)) missingSections.push("Education");
    if (!resumeData.skills?.length || resumeData.skills.length < 3) missingSections.push("Skills Section");

    if (missingSections.length > 0) {
        suggestions.push(`Your resume is missing important sections: ${missingSections.join(", ")}.`);
    }

    if (resumeData.summary && resumeData.summary.length < 150) {
        suggestions.push("Consider expanding your professional summary for better impact.");
    }

    return {
        totalScore: Math.min(100, totalScore.toFixed(1)),
        suggestions,
        missingSections,
        categoryScores,
        keywordFrequency,
    };
};

const calculateCompletion = (resumeData) => {
    let filledFields = 0;
    let totalFields = 0;

    totalFields += 5;
    if (resumeData.name) filledFields++;
    if (resumeData.email) filledFields++;
    if (resumeData.phone) filledFields++;
    if (resumeData.title) filledFields++;
    if (resumeData.location) filledFields++;

    totalFields++;
    if (resumeData.summary) filledFields++;

    resumeData.experience?.forEach(exp => {
        totalFields += 4;
        if (exp.company) filledFields++;
        if (exp.position) filledFields++;
        if (exp.duration) filledFields++;
        if (exp.responsibilities) filledFields++;
    });

    resumeData.education?.forEach(edu => {
        totalFields += 4;
        if (edu.institution) filledFields++;
        if (edu.degree) filledFields++;
        if (edu.duration) filledFields++;
        if (edu.honors) filledFields++;
    });

    totalFields++;
    if (resumeData.skills?.length > 0) filledFields++;

    totalFields++;
    if (resumeData.certifications?.length > 0) filledFields++;

    resumeData.projects?.forEach(proj => {
        totalFields += 3;
        if (proj.title) filledFields++;
        if (proj.description) filledFields++;
        if (proj.technologies) filledFields++;
    });

    totalFields++;
    if (resumeData.achievements) filledFields++;

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
};

const useAutoSave = (data, delay = 1000) => {
    const [status, setStatus] = useState('idle');
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        setStatus('saving');
        const timer = setTimeout(() => {
            localStorage.setItem('resumeData', JSON.stringify(data));
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 1000);
        }, delay);
        return () => clearTimeout(timer);
    }, [data, delay]);

    return status;
};

// Decodes the base64 payload written by Resumes.js back into an ArrayBuffer.
const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// ==================== COMPONENTS ====================
const StatusBar = memo(({ completion, status }) => (
    <div className="status-bar d-flex justify-content-between align-items-center p-2 bg-light rounded mb-3">
        <div className="completion-status d-flex align-items-center">
            <span className="me-2">Completion: {completion}%</span>
            <ProgressBar now={completion} style={{ width: '150px' }} />
        </div>
        <div className="auto-save-status">
            {status === "saving" && <Badge bg="warning" className="p-2"><FaSave className="me-1" /> Saving...</Badge>}
            {status === "saved" && <Badge bg="success" className="p-2"><FaCheck className="me-1" /> Saved</Badge>}
            {status === "error" && <Badge bg="danger" className="p-2"><FaExclamationTriangle className="me-1" /> Error</Badge>}
        </div>
    </div>
));

const FloatingControls = memo(({ template, styledPdf, dynamicAtsFriendly, onToggleStyled, onToggleAts, onOpenSettings, onOpenHelp }) => (
    <div className="floating-controls position-fixed end-0 top-50 translate-middle-y me-3">
        <Card className="shadow-lg">
            <Card.Body className="p-2">
                <div className="quick-actions d-flex flex-column gap-2">
                    <OverlayTrigger placement="left" overlay={<Tooltip>Change Template</Tooltip>}>
                        <Button variant="outline-primary" size="sm" onClick={onOpenSettings}>
                            <FaPalette />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip>Toggle Styled PDF</Tooltip>}>
                        <Button variant={styledPdf ? "primary" : "outline-secondary"} size="sm" onClick={onToggleStyled}>
                            <FaMagic />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip>ATS Optimization</Tooltip>}>
                        <Button variant={dynamicAtsFriendly ? "primary" : "outline-secondary"} size="sm" onClick={onToggleAts}>
                            <FaChartBar />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip>Settings</Tooltip>}>
                        <Button variant="outline-secondary" size="sm" onClick={onOpenSettings}>
                            <FaCog />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip>Help</Tooltip>}>
                        <Button variant="outline-secondary" size="sm" onClick={onOpenHelp}>
                            <FaQuestionCircle />
                        </Button>
                    </OverlayTrigger>
                </div>
            </Card.Body>
        </Card>
    </div>
));

const StepNavigation = memo(({ currentStep, onStepChange }) => {
    const handleStepClick = (index) => {
        onStepChange(index);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    };

    return (
        <Card className="steps-container p-3">
            <h3 className="mb-4 d-flex align-items-center">
                <FaEdit className="me-2" />
                Resume Builder
                <Badge bg="primary" className="ms-auto">{currentStep + 1}/{STEPS.length}</Badge>
            </h3>
            <ListGroup variant="flush">
                {STEPS.map((step, index) => (
                    <ListGroup.Item
                        key={index}
                        active={index === currentStep}
                        onClick={() => handleStepClick(index)}
                        action
                        className="d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="step-badge me-2">{index + 1}</span>
                        {step}
                        {index === currentStep && (
                            <span className="ms-auto">➔</span>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
});

const PersonalInfoStep = memo(({ data, errors, onChange }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaUser className="me-2" />Personal Information</h4>
        <Row className="g-3">
            <Col md={6}>
                <FloatingLabel label="Full Name">
                    <Form.Control value={data.name} onChange={(e) => onChange('name', e.target.value)} isInvalid={!!errors.name} />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="Professional Title">
                    <Form.Control value={data.title} onChange={(e) => onChange('title', e.target.value)} placeholder="e.g., Senior QA Engineer" />
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="Email">
                    <Form.Control type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)} isInvalid={!!errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="Phone">
                    <Form.Control type="tel" value={data.phone} onChange={(e) => onChange('phone', e.target.value)} isInvalid={!!errors.phone} />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="Location">
                    <Form.Control value={data.location} onChange={(e) => onChange('location', e.target.value)} placeholder="City, State" />
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="LinkedIn URL">
                    <Form.Control value={data.linkedin} onChange={(e) => onChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" />
                </FloatingLabel>
            </Col>
            <Col md={12}>
                <FloatingLabel label="Professional Summary">
                    <Form.Control as="textarea" rows={4} value={data.summary} onChange={(e) => onChange('summary', e.target.value)} placeholder="Summarize your experience, strengths, and career goals in 2-3 sentences..." />
                </FloatingLabel>
            </Col>
        </Row>
    </Card>
));

const ExperienceStep = memo(({ data, errors, onArrayChange, onAdd, onRemove }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaBriefcase className="me-2" />Work Experience</h4>
        {data.map((exp, index) => (
            <div key={index} className="experience-item mb-4 p-3 border rounded">
                <Row className="g-3">
                    <Col md={6}><FloatingLabel label="Company"><Form.Control value={exp.company} onChange={(e) => onArrayChange('experience', index, 'company', e.target.value)} isInvalid={!!errors[`experience-${index}-company`]} /></FloatingLabel></Col>
                    <Col md={6}><FloatingLabel label="Position"><Form.Control value={exp.position} onChange={(e) => onArrayChange('experience', index, 'position', e.target.value)} isInvalid={!!errors[`experience-${index}-position`]} /></FloatingLabel></Col>
                    <Col md={6}><FloatingLabel label="Duration"><Form.Control value={exp.duration} onChange={(e) => onArrayChange('experience', index, 'duration', e.target.value)} placeholder="e.g., Jan 2020 - Present" /></FloatingLabel></Col>
                    <Col md={12}><FloatingLabel label="Responsibilities"><Form.Control as="textarea" rows={3} value={exp.responsibilities} onChange={(e) => onArrayChange('experience', index, 'responsibilities', e.target.value)} placeholder="List key responsibilities and achievements, one per line" /></FloatingLabel></Col>
                    <Col className="text-end"><Button variant="danger" size="sm" onClick={() => onRemove('experience', index)}><FaTrash /> Remove</Button></Col>
                </Row>
            </div>
        ))}
        <Button variant="outline-primary" onClick={() => onAdd('experience', { company: "", position: "", duration: "", responsibilities: "" })}><FaPlus /> Add Experience</Button>
    </Card>
));

const EducationStep = memo(({ data, errors, onArrayChange, onAdd, onRemove }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaGraduationCap className="me-2" />Education</h4>
        {data.map((edu, index) => (
            <div key={index} className="education-item mb-4 p-3 border rounded">
                <Row className="g-3">
                    <Col md={6}><FloatingLabel label="Institution"><Form.Control value={edu.institution} onChange={(e) => onArrayChange('education', index, 'institution', e.target.value)} isInvalid={!!errors[`education-${index}-institution`]} /></FloatingLabel></Col>
                    <Col md={6}><FloatingLabel label="Degree"><Form.Control value={edu.degree} onChange={(e) => onArrayChange('education', index, 'degree', e.target.value)} placeholder="e.g., Bachelor of Science in Computer Science" /></FloatingLabel></Col>
                    <Col md={6}><FloatingLabel label="Duration"><Form.Control value={edu.duration} onChange={(e) => onArrayChange('education', index, 'duration', e.target.value)} placeholder="e.g., 2016 - 2020" /></FloatingLabel></Col>
                    <Col md={6}><FloatingLabel label="Honors/Awards"><Form.Control value={edu.honors} onChange={(e) => onArrayChange('education', index, 'honors', e.target.value)} placeholder="e.g., Cum Laude, Dean's List" /></FloatingLabel></Col>
                    <Col className="text-end"><Button variant="danger" size="sm" onClick={() => onRemove('education', index)}><FaTrash /> Remove</Button></Col>
                </Row>
            </div>
        ))}
        <Button variant="outline-primary" onClick={() => onAdd('education', { institution: "", degree: "", duration: "", honors: "" })}><FaPlus /> Add Education</Button>
    </Card>
));

const SkillsStep = memo(({ data, onChange }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaCode className="me-2" />Skills & Certifications</h4>
        <Row className="g-3">
            <Col md={6}>
                <FloatingLabel label="Technical Skills (comma separated)">
                    <Form.Control as="textarea" rows={3} value={data.skills?.join(", ")} onChange={(e) => onChange('skills', e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="e.g., Selenium, Java, Python, Jenkins, AWS" />
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="Certifications (comma separated)">
                    <Form.Control as="textarea" rows={3} value={data.certifications?.join(", ")} onChange={(e) => onChange('certifications', e.target.value.split(",").map(c => c.trim()).filter(Boolean))} placeholder="e.g., ISTQB, AWS Certified, Scrum Master" />
                </FloatingLabel>
            </Col>
        </Row>
    </Card>
));

const ProjectsStep = memo(({ data, errors, onArrayChange, onAdd, onRemove }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaCode className="me-2" />Projects</h4>
        {data.map((proj, index) => (
            <div key={index} className="project-item mb-4 p-3 border rounded">
                <Row className="g-3">
                    <Col md={6}><FloatingLabel label="Project Title"><Form.Control value={proj.title} onChange={(e) => onArrayChange('projects', index, 'title', e.target.value)} isInvalid={!!errors[`projects-${index}-title`]} /></FloatingLabel></Col>
                    <Col md={6}><FloatingLabel label="Technologies Used"><Form.Control value={proj.technologies} onChange={(e) => onArrayChange('projects', index, 'technologies', e.target.value)} placeholder="e.g., React, Node.js, MongoDB" /></FloatingLabel></Col>
                    <Col md={12}><FloatingLabel label="Project Description"><Form.Control as="textarea" rows={3} value={proj.description} onChange={(e) => onArrayChange('projects', index, 'description', e.target.value)} placeholder="Describe the project, your role, and key achievements..." /></FloatingLabel></Col>
                    <Col className="text-end"><Button variant="danger" size="sm" onClick={() => onRemove('projects', index)}><FaTrash /> Remove</Button></Col>
                </Row>
            </div>
        ))}
        <Button variant="outline-primary" onClick={() => onAdd('projects', { title: "", description: "", technologies: "" })}><FaPlus /> Add Project</Button>
    </Card>
));

const AchievementsStep = memo(({ data, onChange }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaAward className="me-2" />Achievements</h4>
        <FloatingLabel label="Achievements & Awards">
            <Form.Control as="textarea" rows={5} value={data.achievements} onChange={(e) => onChange('achievements', e.target.value)} placeholder="e.g.,&#10;Employee of the Month, March 2023&#10;Delivered a key project ahead of schedule&#10;Published an article on QA best practices" />
        </FloatingLabel>
    </Card>
));

const ResumePreview = memo(({
                                data,
                                template,
                                theme,
                                layout,
                                scale,
                                onOpenTemplateSelector
                            }) => (
    <div className="preview-container">
        <div className="preview-controls mb-3 d-flex justify-content-between align-items-center">
            <ButtonGroup size="sm">
                <Button variant="outline-secondary" onClick={() => scale.set(Math.max(0.7, scale.value - 0.1))}>
                    <FaArrowLeft /> -
                </Button>
                <Button variant="outline-secondary" disabled>
                    {Math.round(scale.value * 100)}%
                </Button>
                <Button variant="outline-secondary" onClick={() => scale.set(Math.min(1.2, scale.value + 0.1))}>
                    + <FaArrowRight />
                </Button>
            </ButtonGroup>

            <Button variant="outline-primary" size="sm" onClick={onOpenTemplateSelector}>
                <FaPalette className="me-1" /> Change Template
            </Button>
        </div>

        <div
            className="resume-preview-wrapper"
            style={{
                transform: `scale(${scale.value})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease'
            }}
        >
            <ResumeTemplates
                data={data}
                template={template}
                theme={theme}
                layout={layout}
            />
        </div>
    </div>
));

const ATSDashboard = memo(({ results, darkMode }) => (
    <div className="ats-dashboard mt-4 p-4 bg-light rounded">
        <h4><FaChartBar className="me-2" />ATS Optimization Dashboard</h4>
        <div className="radial-progress-container d-flex justify-content-around my-4">
            {results.categoryScores?.map((cat, index) => (
                <div key={index} className="radial-progress text-center" style={{ width: '100px' }}>
                    <CircularProgressbar value={cat.score} text={`${cat.score}%`} styles={{ path: { stroke: `rgba(41, 128, 185, ${0.8 - index * 0.2})` }, text: { fill: darkMode ? '#fff' : '#2c3e50', fontSize: '16px' } }} />
                    <div className="radial-label mt-2">{cat.name}</div>
                </div>
            ))}
        </div>
        {results.suggestions?.length > 0 && (
            <Alert variant="warning" className="mt-3">
                <h5><FaExclamationTriangle className="me-2" />Improvement Suggestions</h5>
                <ul className="mb-0">{results.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}</ul>
            </Alert>
        )}
    </div>
));

const UploadSuccessAlert = memo(({ fileName, onDismiss }) => (
    <div className="upload-success-alert position-fixed top-0 start-50 translate-middle-x mt-3 z-3">
        <Alert variant="success" className="shadow-lg">
            <div className="d-flex align-items-center">
                <FaCheck className="me-2" size={20} />
                <div>
                    <strong>Resume uploaded</strong>
                    <div className="small">We pulled what we could from &ldquo;{fileName}&rdquo; into the form below &mdash; please review each field before continuing.</div>
                </div>
                <Button variant="link" className="ms-3 p-0" onClick={onDismiss}><FaTimes /></Button>
            </div>
        </Alert>
    </div>
));

// ==================== MAIN COMPONENT ====================
const ResumeGenerator = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        return saved ? JSON.parse(saved) : INITIAL_RESUME_DATA;
    });
    const [currentStep, setCurrentStep] = useState(0);
    const [atsResult, setAtsResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState('classic');
    const [previewScale, setPreviewScale] = useState(0.9);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [layout, setLayout] = useState("single-column");
    const [theme, setTheme] = useState("light");
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [styledPdf, setStyledPdf] = useState(true);
    const [dynamicAtsFriendly, setDynamicAtsFriendly] = useState(true);
    const [sections, setSections] = useState(INITIAL_SECTIONS);
    const [isProcessingUpload, setIsProcessingUpload] = useState(false);
    const [showUploadSuccess, setShowUploadSuccess] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [uploadError, setUploadError] = useState("");

    const resumeContentRef = useRef(null);
    const autoSaveStatus = useAutoSave(resumeData);
    const completionPercentage = calculateCompletion(resumeData);

    // ==================== PROCESS UPLOADED RESUME ====================
    // Reads the file handed off by Resumes.js via sessionStorage, extracts
    // text with pdf.js, and best-effort-parses it into the form fields.
    useEffect(() => {
        const processUploadedFile = async () => {
            const stored = sessionStorage.getItem(UPLOAD_STORAGE_KEY);
            if (!stored) return;

            setIsProcessingUpload(true);
            setUploadError("");

            try {
                const { name, data } = JSON.parse(stored);
                setUploadedFileName(name);

                const arrayBuffer = base64ToArrayBuffer(data);
                const text = await extractTextFromPDF(arrayBuffer);

                if (!text) {
                    throw new Error("Could not read text from this PDF.");
                }

                const parsedResume = parseResumeText(text);

                setResumeData(prev => ({
                    ...prev,
                    name: parsedResume.name || prev.name,
                    email: parsedResume.email || prev.email,
                    phone: parsedResume.phone || prev.phone,
                    location: parsedResume.location || prev.location,
                    linkedin: parsedResume.linkedin || prev.linkedin,
                    github: parsedResume.github || prev.github,
                    title: parsedResume.title || prev.title,
                    summary: parsedResume.summary || prev.summary,
                    skills: parsedResume.skills.length > 0
                        ? [...new Set([...prev.skills, ...parsedResume.skills])]
                        : prev.skills,
                    certifications: parsedResume.certifications.length > 0
                        ? [...new Set([...prev.certifications, ...parsedResume.certifications])]
                        : prev.certifications,
                    experience: parsedResume.experience.length > 0
                        ? parsedResume.experience
                        : prev.experience,
                    education: parsedResume.education.length > 0
                        ? parsedResume.education
                        : prev.education,
                    achievements: parsedResume.achievements || prev.achievements,
                }));

                setShowUploadSuccess(true);
                setTimeout(() => setShowUploadSuccess(false), 5000);
            } catch (error) {
                console.error("Error processing uploaded file:", error);
                setUploadError("We couldn't read that resume automatically. You can still fill in the form manually below.");
            } finally {
                sessionStorage.removeItem(UPLOAD_STORAGE_KEY);
                setIsProcessingUpload(false);
            }
        };

        processUploadedFile();
    }, []);

    const debouncedAnalysis = useCallback(debounce((data) => { setAtsResult(analyzeResume(data)); }, 500), []);
    useEffect(() => { debouncedAnalysis(resumeData); return () => debouncedAnalysis.cancel(); }, [resumeData, debouncedAnalysis]);

    useEffect(() => {
        if (currentUser) {
            setResumeData(prev => ({ ...prev, name: currentUser.displayName || prev.name, email: currentUser.email || prev.email, phone: currentUser.phoneNumber || prev.phone }));
        }
    }, [currentUser]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const handleInputChange = useCallback((field, value) => { setResumeData(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: "" })); }, []);
    const handleArrayChange = useCallback((field, index, subField, value) => { setResumeData(prev => { const updatedArray = [...prev[field]]; updatedArray[index] = { ...updatedArray[index], [subField]: value }; return { ...prev, [field]: updatedArray }; }); setErrors(prev => ({ ...prev, [`${field}-${index}-${subField}`]: undefined })); }, []);
    const handleAddSection = useCallback((field, initialValue) => { setResumeData(prev => ({ ...prev, [field]: [...(prev[field] || []), initialValue] })); }, []);
    const handleRemoveSection = useCallback((field, index) => { setResumeData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) })); }, []);

    const validateStep = useCallback((step) => {
        const newErrors = {};
        if (step === 0) {
            if (!resumeData.name?.trim()) newErrors.name = "Name is required";
            if (!resumeData.email?.trim()) newErrors.email = "Email is required";
            if (!resumeData.phone?.trim()) newErrors.phone = "Phone is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [resumeData]);

    const handleStepChange = useCallback((direction) => {
        if (direction === "next" && !validateStep(currentStep)) return;
        setCurrentStep(prev => direction === "next" ? prev + 1 : prev - 1);
    }, [currentStep, validateStep]);

    const handleGeneratePDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const element = document.querySelector('.resume-preview-wrapper');
            if (!element) throw new Error("Resume content not found!");

            const canvas = await html2canvas(element, { scale: 3, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${resumeData.name || 'Resume'}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("We couldn't generate the PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const onDragEnd = useCallback((result) => { if (!result.destination) return; const items = Array.from(sections); const [reorderedItem] = items.splice(result.source.index, 1); items.splice(result.destination.index, 0, reorderedItem); setSections(items); }, [sections]);

    return (
        <Container fluid className={`resume-generator-container ${darkMode ? 'dark-mode' : ''}`}>

            {isProcessingUpload && (
                <div className="upload-processing-overlay position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000 }}>
                    <Card className="text-center p-4"><FaSpinner className="spinner-animation mb-3" size={40} /><h5>Reading your resume&hellip;</h5><p className="text-muted mb-0">Extracting information from &ldquo;{uploadedFileName}&rdquo;</p></Card>
                </div>
            )}
            {showUploadSuccess && <UploadSuccessAlert fileName={uploadedFileName} onDismiss={() => setShowUploadSuccess(false)} />}
            {uploadError && (
                <Alert variant="warning" dismissible onClose={() => setUploadError("")} className="mb-3">
                    {uploadError}
                </Alert>
            )}

            <StatusBar completion={completionPercentage} status={autoSaveStatus} />
            <FloatingControls template={activeTemplate} styledPdf={styledPdf} dynamicAtsFriendly={dynamicAtsFriendly} onToggleStyled={() => setStyledPdf(prev => !prev)} onToggleAts={() => setDynamicAtsFriendly(prev => !prev)} onOpenSettings={() => setShowSettings(true)} onOpenHelp={() => setShowHelp(true)} />

            <Row className="g-4">
                <Col lg={3}><StepNavigation currentStep={currentStep} onStepChange={setCurrentStep} /></Col>
                <Col lg={9}>
                    <div>
                        {currentStep === 0 && <PersonalInfoStep data={resumeData} errors={errors} onChange={handleInputChange} />}
                        {currentStep === 1 && <ExperienceStep data={resumeData.experience} errors={errors} onArrayChange={handleArrayChange} onAdd={handleAddSection} onRemove={handleRemoveSection} />}
                        {currentStep === 2 && <EducationStep data={resumeData.education} errors={errors} onArrayChange={handleArrayChange} onAdd={handleAddSection} onRemove={handleRemoveSection} />}
                        {currentStep === 3 && <SkillsStep data={resumeData} onChange={handleInputChange} />}
                        {currentStep === 4 && <ProjectsStep data={resumeData.projects} errors={errors} onArrayChange={handleArrayChange} onAdd={handleAddSection} onRemove={handleRemoveSection} />}
                        {currentStep === 5 && <AchievementsStep data={resumeData} onChange={handleInputChange} />}
                        {currentStep === 6 && <ResumePreview data={resumeData} template={activeTemplate} theme={theme} layout={layout} scale={{ value: previewScale, set: setPreviewScale }} onOpenTemplateSelector={() => setShowTemplateSelector(true)} />}
                    </div>

                    <div className="navigation-buttons mt-4 d-flex justify-content-between">
                        <div>{currentStep > 0 && <Button variant="secondary" onClick={() => handleStepChange("prev")}><FaArrowLeft className="me-2" /> Previous</Button>}</div>
                        <div>{currentStep < STEPS.length - 1 ? <Button variant="primary" onClick={() => handleStepChange("next")}>Next <FaArrowRight className="ms-2" /></Button> : <Button variant="success" onClick={handleGeneratePDF} disabled={isGeneratingPDF}>{isGeneratingPDF ? "Generating..." : <><FaFilePdf className="me-2" /> Download PDF</>}</Button>}</div>
                    </div>

                    {atsResult && <ATSDashboard results={atsResult} darkMode={darkMode} />}
                </Col>
            </Row>

            {/* Template Selector Modal */}
            <Modal show={showTemplateSelector} onHide={() => setShowTemplateSelector(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title><FaPalette className="me-2" />Choose Your Resume Template</Modal.Title></Modal.Header>
                <Modal.Body><TemplateSelector currentTemplate={activeTemplate} onSelectTemplate={(templateId) => { setActiveTemplate(templateId); setShowTemplateSelector(false); }} /></Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowTemplateSelector(false)}>Close</Button></Modal.Footer>
            </Modal>

            {/* Settings Modal */}
            <Modal show={showSettings} onHide={() => setShowSettings(false)} size="lg">
                <Modal.Header closeButton><Modal.Title><FaCog className="me-2" />Resume Settings</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3"><Form.Label>Dark Mode</Form.Label><div><ReactSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} onColor="#2c3e50" offColor="#adb5bd" /></div></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Theme Color</Form.Label><Form.Select value={theme} onChange={(e) => setTheme(e.target.value)}>{Object.keys({ light: 'Light', dark: 'Dark', professional: 'Professional', colorful: 'Colorful' }).map(key => <option key={key} value={key}>{key}</option>)}</Form.Select></Form.Group>
                        <Form.Group className="mb-3"><Form.Label className="d-flex align-items-center"><FaPalette className="me-2" /> Styled PDF Template</Form.Label><div className="d-flex align-items-center"><ReactSwitch checked={styledPdf} onChange={() => setStyledPdf(!styledPdf)} onColor="#2c3e50" offColor="#adb5bd" /><span className="ms-3 text-muted">Apply custom fonts, colors, and layout for a polished look</span></div></Form.Group>
                        <Form.Group className="mb-3"><Form.Label className="d-flex align-items-center"><FaMagic className="me-2" /> ATS-Friendly Formatting</Form.Label><div className="d-flex align-items-center"><ReactSwitch checked={dynamicAtsFriendly} onChange={() => setDynamicAtsFriendly(!dynamicAtsFriendly)} onColor="#2c3e50" offColor="#adb5bd" /><span className="ms-3 text-muted">Ensure structured headers, bullet points, and proper keyword placement</span></div></Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowSettings(false)}>Close</Button><Button variant="primary" onClick={() => setShowSettings(false)}>Save Changes</Button></Modal.Footer>
            </Modal>

            {/* Help Modal */}
            <Modal show={showHelp} onHide={() => setShowHelp(false)} size="lg">
                <Modal.Header closeButton><Modal.Title><FaQuestionCircle className="me-2" />Resume Builder Help</Modal.Title></Modal.Header>
                <Modal.Body>
                    <h5>Getting Started</h5>
                    <p>Work through the steps on the left to build your resume. Each step covers one section of the final document.</p>
                    <h5 className="mt-4">Uploading an Existing Resume</h5>
                    <p>From the Resume Library page, you can upload a PDF resume and we'll try to extract your information automatically. Always review the pre-filled fields, since automatic extraction isn't perfect.</p>
                    <h5 className="mt-4">Templates</h5>
                    <p>Choose from eight professional templates: Classic, Modern, Sidebar, Creative, Tech, Executive, Academic, and Startup.</p>
                    <h5 className="mt-4">ATS Optimization</h5>
                    <p>The ATS dashboard shows how well your resume matches common keyword categories. Aim for scores above 70% in each category.</p>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowHelp(false)}>Close</Button></Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ResumeGenerator;