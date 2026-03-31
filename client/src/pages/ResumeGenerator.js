import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import {
    Container, Button, Form, Row, Col, Card, ListGroup, OverlayTrigger,
    Tooltip, FloatingLabel, ButtonGroup, ProgressBar, Modal, Alert, Badge
} from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import {
    FaPlus, FaChartBar, FaUser, FaEnvelope, FaPhone,
    FaMagic, FaEdit, FaBriefcase, FaGraduationCap, FaCode,
    FaAward, FaTrash, FaDownload, FaCog, FaEye, FaPalette,
    FaColumns, FaQuestionCircle, FaCheck, FaExclamationTriangle,
    FaSave, FaFilePdf, FaArrowLeft, FaArrowRight, FaGripVertical
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactSwitch from "react-switch";
import { debounce } from "lodash";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./ResumeGenerator.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    summary: "",
    experience: [{ company: "", position: "", duration: "", responsibilities: "" }],
    education: [{ institution: "", degree: "", duration: "", honors: "" }],
    skills: [],
    certifications: [],
    projects: [{ title: "", description: "", technologies: "" }],
    achievements: "",
};

const TEMPLATES = {
    professional: { name: 'Professional', colors: ['#2c3e50', '#2980b9'], style: 'classic' },
    modern: { name: 'Modern', colors: ['#27ae60', '#2ecc71'], style: 'clean' },
    creative: { name: 'Creative', colors: ['#e74c3c', '#e67e22'], style: 'bold' },
    executive: { name: 'Executive', colors: ['#34495e', '#9b59b6'], style: 'elegant' },
    minimalist: { name: 'Minimalist', colors: ['#7f8c8d', '#bdc3c7'], style: 'simple' },
    tech: { name: 'Tech', colors: ['#3498db', '#2c3e50'], style: 'technical' },
    academic: { name: 'Academic', colors: ['#8e44ad', '#3498db'], style: 'formal' },
    startup: { name: 'Startup', colors: ['#e74c3c', '#f39c12'], style: 'innovative' }
};

const THEMES = {
    light: { background: "#ffffff", text: "#000000", primary: "#2c3e50", secondary: "#2980b9" },
    dark: { background: "#2c3e50", text: "#ffffff", primary: "#2980b9", secondary: "#2ecc71" },
    colorful: { background: "#f0f0f0", text: "#333333", primary: "#e74c3c", secondary: "#e67e22" },
    professional: { background: "#f8f9fa", text: "#495057", primary: "#343a40", secondary: "#6c757d" },
    pastel: { background: "#f8f9fa", text: "#495057", primary: "#a5d8ff", secondary: "#ffd6a5" },
    highContrast: { background: "#000000", text: "#ffffff", primary: "#ffff00", secondary: "#ff00ff" }
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
    if (!resumeData.experience?.length) missingSections.push("Work Experience");
    if (!resumeData.projects?.length) missingSections.push("Projects");
    if (!resumeData.education?.length) missingSections.push("Education");
    if (!resumeData.skills?.length || resumeData.skills.length < 3) missingSections.push("Skills Section");

    if (missingSections.length > 0) {
        suggestions.push(`Your resume is missing important sections: ${missingSections.join(", ")}.`);
    }

    if (resumeData.summary && resumeData.summary.length < 150) {
        suggestions.push("Consider expanding your professional summary for better impact.");
    }

    const words = resumeText.split(/\s+/).length;
    const sentences = Math.max(1, resumeText.split(/[.!?]+/).length);
    const syllables = resumeText.split(/[aeiouy]{1,2}/).length;
    const readabilityScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));

    return {
        totalScore: Math.min(100, totalScore.toFixed(1)),
        readability: Math.min(100, Math.max(0, readabilityScore.toFixed(1))),
        suggestions,
        missingSections,
        categoryScores,
        keywordFrequency,
    };
};

const calculateCompletion = (resumeData) => {
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
    resumeData.experience?.forEach(exp => {
        totalFields += 4;
        if (exp.company) filledFields++;
        if (exp.position) filledFields++;
        if (exp.duration) filledFields++;
        if (exp.responsibilities) filledFields++;
    });

    // Education
    resumeData.education?.forEach(edu => {
        totalFields += 4;
        if (edu.institution) filledFields++;
        if (edu.degree) filledFields++;
        if (edu.duration) filledFields++;
        if (edu.honors) filledFields++;
    });

    // Skills
    totalFields++;
    if (resumeData.skills?.length > 0) filledFields++;

    // Certifications
    totalFields++;
    if (resumeData.certifications?.length > 0) filledFields++;

    // Projects
    resumeData.projects?.forEach(proj => {
        totalFields += 3;
        if (proj.title) filledFields++;
        if (proj.description) filledFields++;
        if (proj.technologies) filledFields++;
    });

    // Achievements
    totalFields++;
    if (resumeData.achievements) filledFields++;

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
};

// ==================== CUSTOM HOOKS ====================
const useAutoSave = (data, delay = 1000) => {
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (data !== INITIAL_RESUME_DATA) {
            setStatus('saving');
            const timer = setTimeout(() => {
                // Simulate save to localStorage/API
                localStorage.setItem('resumeData', JSON.stringify(data));
                setStatus('saved');
                setTimeout(() => setStatus('idle'), 1000);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [data, delay]);

    return status;
};

// ==================== COMPONENTS ====================
const StatusBar = memo(({ completion, status }) => (
    <div className="status-bar d-flex justify-content-between align-items-center p-2 bg-light rounded mb-3">
        <div className="completion-status d-flex align-items-center">
            <span className="me-2">Completion: {completion}%</span>
            <ProgressBar now={completion} style={{ width: '150px' }} />
        </div>
        <div className="auto-save-status">
            {status === "saving" && (
                <Badge bg="warning" className="p-2">
                    <FaSave className="me-1" /> Saving...
                </Badge>
            )}
            {status === "saved" && (
                <Badge bg="success" className="p-2">
                    <FaCheck className="me-1" /> Saved
                </Badge>
            )}
            {status === "error" && (
                <Badge bg="danger" className="p-2">
                    <FaExclamationTriangle className="me-1" /> Error
                </Badge>
            )}
        </div>
    </div>
));

const FloatingControls = memo(({ template, styledPdf, dynamicAtsFriendly, onToggleStyled, onToggleAts, onOpenSettings, onOpenHelp }) => (
    <div className="floating-controls position-fixed end-0 top-50 translate-middle-y me-3">
        <Card className="shadow-lg">
            <Card.Body className="p-2">
                <div className="template-preview mb-2 text-center">
                    <Badge bg="secondary">{TEMPLATES[template].name}</Badge>
                    <div className="template-colors mt-1">
                        <span className="color-dot" style={{ backgroundColor: TEMPLATES[template].colors[0] }} />
                        <span className="color-dot" style={{ backgroundColor: TEMPLATES[template].colors[1] }} />
                    </div>
                </div>
                <div className="quick-actions d-flex flex-column gap-2">
                    <OverlayTrigger placement="left" overlay={<Tooltip>Toggle Styled PDF</Tooltip>}>
                        <Button variant={styledPdf ? "primary" : "outline-secondary"} size="sm" onClick={onToggleStyled}>
                            <FaPalette />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip>Toggle ATS Optimization</Tooltip>}>
                        <Button variant={dynamicAtsFriendly ? "primary" : "outline-secondary"} size="sm" onClick={onToggleAts}>
                            <FaMagic />
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

const StepNavigation = memo(({ currentStep, onStepChange }) => (
    <Card className="steps-container p-3">
        <h3 className="mb-4 d-flex align-items-center">
            <FaEdit className="me-2" />
            Resume Builder
            <Badge bg="primary" className="ms-auto">
                {currentStep + 1}/{STEPS.length}
            </Badge>
        </h3>
        <ListGroup variant="flush">
            {STEPS.map((step, index) => (
                <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <ListGroup.Item
                        active={index === currentStep}
                        onClick={() => onStepChange(index)}
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
    </Card>
));

const PersonalInfoStep = memo(({ data, errors, onChange }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaUser className="me-2" />Personal Information</h4>
        <Row className="g-3">
            <Col md={6}>
                <FloatingLabel controlId="name" label="Full Name">
                    <Form.Control
                        value={data.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        isInvalid={!!errors.name}
                        className="input-glass"
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel controlId="email" label="Email">
                    <Form.Control
                        type="email"
                        value={data.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        isInvalid={!!errors.email}
                        className="input-glass"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel controlId="phone" label="Phone">
                    <Form.Control
                        type="tel"
                        value={data.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
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
                        value={data.summary}
                        onChange={(e) => onChange('summary', e.target.value)}
                        className="input-glass"
                    />
                </FloatingLabel>
            </Col>
        </Row>
    </Card>
));

const ExperienceStep = memo(({ data, errors, onArrayChange, onAdd, onRemove }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaBriefcase className="me-2" />Experience</h4>
        <AnimatePresence>
            {data.map((exp, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="experience-item mb-4 p-3 border rounded"
                >
                    <Row className="g-3">
                        <Col md={6}>
                            <FloatingLabel label="Company">
                                <Form.Control
                                    value={exp.company}
                                    onChange={(e) => onArrayChange('experience', index, 'company', e.target.value)}
                                    isInvalid={!!errors[`experience-${index}-company`]}
                                    className="input-glass"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`experience-${index}-company`]}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        <Col md={6}>
                            <FloatingLabel label="Position">
                                <Form.Control
                                    value={exp.position}
                                    onChange={(e) => onArrayChange('experience', index, 'position', e.target.value)}
                                    isInvalid={!!errors[`experience-${index}-position`]}
                                    className="input-glass"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`experience-${index}-position`]}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        <Col md={6}>
                            <FloatingLabel label="Duration">
                                <Form.Control
                                    value={exp.duration}
                                    onChange={(e) => onArrayChange('experience', index, 'duration', e.target.value)}
                                    className="input-glass"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md={12}>
                            <FloatingLabel label="Responsibilities">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={exp.responsibilities}
                                    onChange={(e) => onArrayChange('experience', index, 'responsibilities', e.target.value)}
                                    className="input-glass"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onRemove('experience', index)}
                            >
                                <FaTrash /> Remove
                            </Button>
                        </Col>
                    </Row>
                </motion.div>
            ))}
        </AnimatePresence>
        <Button variant="outline-primary" onClick={() => onAdd('experience', { company: "", position: "", duration: "", responsibilities: "" })}>
            <FaPlus /> Add Experience
        </Button>
    </Card>
));

const EducationStep = memo(({ data, errors, onArrayChange, onAdd, onRemove }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaGraduationCap className="me-2" />Education</h4>
        <AnimatePresence>
            {data.map((edu, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="education-item mb-4 p-3 border rounded"
                >
                    <Row className="g-3">
                        <Col md={6}>
                            <FloatingLabel label="Institution">
                                <Form.Control
                                    value={edu.institution}
                                    onChange={(e) => onArrayChange('education', index, 'institution', e.target.value)}
                                    isInvalid={!!errors[`education-${index}-institution`]}
                                    className="input-glass"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`education-${index}-institution`]}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        <Col md={6}>
                            <FloatingLabel label="Degree">
                                <Form.Control
                                    value={edu.degree}
                                    onChange={(e) => onArrayChange('education', index, 'degree', e.target.value)}
                                    isInvalid={!!errors[`education-${index}-degree`]}
                                    className="input-glass"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`education-${index}-degree`]}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        <Col md={6}>
                            <FloatingLabel label="Duration">
                                <Form.Control
                                    value={edu.duration}
                                    onChange={(e) => onArrayChange('education', index, 'duration', e.target.value)}
                                    className="input-glass"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md={6}>
                            <FloatingLabel label="Honors/Awards">
                                <Form.Control
                                    value={edu.honors}
                                    onChange={(e) => onArrayChange('education', index, 'honors', e.target.value)}
                                    className="input-glass"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col className="text-end">
                            <Button variant="danger" size="sm" onClick={() => onRemove('education', index)}>
                                <FaTrash /> Remove
                            </Button>
                        </Col>
                    </Row>
                </motion.div>
            ))}
        </AnimatePresence>
        <Button variant="outline-primary" onClick={() => onAdd('education', { institution: "", degree: "", duration: "", honors: "" })}>
            <FaPlus /> Add Education
        </Button>
    </Card>
));

const SkillsStep = memo(({ data, onChange }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaCode className="me-2" />Skills & Certifications</h4>
        <Row className="g-3">
            <Col md={6}>
                <FloatingLabel label="Skills (comma separated)">
                    <Form.Control
                        value={data.skills?.join(", ")}
                        onChange={(e) => onChange('skills', e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                        className="input-glass"
                    />
                </FloatingLabel>
            </Col>
            <Col md={6}>
                <FloatingLabel label="Certifications (comma separated)">
                    <Form.Control
                        value={data.certifications?.join(", ")}
                        onChange={(e) => onChange('certifications', e.target.value.split(",").map(c => c.trim()).filter(Boolean))}
                        className="input-glass"
                    />
                </FloatingLabel>
            </Col>
        </Row>
    </Card>
));

const ProjectsStep = memo(({ data, errors, onArrayChange, onAdd, onRemove }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaCode className="me-2" />Projects</h4>
        <AnimatePresence>
            {data.map((proj, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="project-item mb-4 p-3 border rounded"
                >
                    <Row className="g-3">
                        <Col md={6}>
                            <FloatingLabel label="Title">
                                <Form.Control
                                    value={proj.title}
                                    onChange={(e) => onArrayChange('projects', index, 'title', e.target.value)}
                                    isInvalid={!!errors[`projects-${index}-title`]}
                                    className="input-glass"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`projects-${index}-title`]}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        <Col md={6}>
                            <FloatingLabel label="Technologies">
                                <Form.Control
                                    value={proj.technologies}
                                    onChange={(e) => onArrayChange('projects', index, 'technologies', e.target.value)}
                                    className="input-glass"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md={12}>
                            <FloatingLabel label="Description">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={proj.description}
                                    onChange={(e) => onArrayChange('projects', index, 'description', e.target.value)}
                                    isInvalid={!!errors[`projects-${index}-description`]}
                                    className="input-glass"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`projects-${index}-description`]}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        <Col className="text-end">
                            <Button variant="danger" size="sm" onClick={() => onRemove('projects', index)}>
                                <FaTrash /> Remove
                            </Button>
                        </Col>
                    </Row>
                </motion.div>
            ))}
        </AnimatePresence>
        <Button variant="outline-primary" onClick={() => onAdd('projects', { title: "", description: "", technologies: "" })}>
            <FaPlus /> Add Project
        </Button>
    </Card>
));

const AchievementsStep = memo(({ data, onChange }) => (
    <Card className="p-4 hover-shadow">
        <h4 className="mb-4"><FaAward className="me-2" />Achievements</h4>
        <FloatingLabel label="Achievements">
            <Form.Control
                as="textarea"
                rows={4}
                value={data.achievements}
                onChange={(e) => onChange('achievements', e.target.value)}
                className="input-glass"
            />
        </FloatingLabel>
    </Card>
));

const ResumePreview = memo(({
    data,
    template,
    theme,
    layout,
    scale,
    sections,
    onDragEnd,
    renderSection
}) => (
    <div className="preview-container">
        <div className="preview-controls mb-3">
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
        </div>

        <motion.div
            className={`resume-template ${layout} ${TEMPLATES[template].style}`}
            id="resume-content"
            style={{
                transform: `scale(${scale.value})`,
                backgroundColor: THEMES[theme].background,
                color: THEMES[theme].text,
                transformOrigin: 'top left'
            }}
            transition={{ type: "spring", stiffness: 200 }}
        >
            <header className="resume-header text-center mb-4">
                <h1 className="name-gradient">{data.name}</h1>
                <div className="contact-badges d-flex justify-content-center gap-3">
                    {data.email && (
                        <Badge bg="secondary" className="p-2">
                            <FaEnvelope className="me-1" /> {data.email}
                        </Badge>
                    )}
                    {data.phone && (
                        <Badge bg="secondary" className="p-2">
                            <FaPhone className="me-1" /> {data.phone}
                        </Badge>
                    )}
                </div>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="resume-sections">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`resume-sections ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                        >
                            {sections.map((section, index) => (
                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                marginBottom: '16px',
                                                position: 'relative'
                                            }}
                                        >
                                            <div className="drag-handle" {...provided.dragHandleProps}>
                                                <FaGripVertical className="text-muted" />
                                            </div>
                                            {renderSection(section, data)}
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
));

const ATSDashboard = memo(({ results, darkMode }) => (
    <motion.div
        className="ats-dashboard mt-4 p-4 bg-light rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        <h4><FaChartBar className="me-2" />ATS Optimization Dashboard</h4>
        <div className="radial-progress-container d-flex justify-content-around my-4">
            {results.categoryScores?.map((cat, index) => (
                <div key={index} className="radial-progress text-center" style={{ width: '100px' }}>
                    <CircularProgressbar
                        value={cat.score}
                        text={`${cat.score}%`}
                        styles={{
                            path: { stroke: `rgba(41, 128, 185, ${0.8 - index * 0.2})` },
                            text: { fill: darkMode ? '#fff' : '#2c3e50', fontSize: '16px' }
                        }}
                    />
                    <div className="radial-label mt-2">{cat.name}</div>
                </div>
            ))}
        </div>
        {results.suggestions?.length > 0 && (
            <Alert variant="warning" className="mt-3">
                <h5><FaExclamationTriangle className="me-2" />Improvement Suggestions</h5>
                <ul className="mb-0">
                    {results.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            </Alert>
        )}
    </motion.div>
));

// ==================== MAIN COMPONENT ====================
const ResumeGenerator = () => {
    const { currentUser } = useAuth();
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        return saved ? JSON.parse(saved) : INITIAL_RESUME_DATA;
    });
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
    const [styledPdf, setStyledPdf] = useState(true);
    const [dynamicAtsFriendly, setDynamicAtsFriendly] = useState(true);
    const [sections, setSections] = useState(INITIAL_SECTIONS);

    const resumeContentRef = useRef(null);
    const autoSaveStatus = useAutoSave(resumeData);
    const completionPercentage = calculateCompletion(resumeData);

    // Debounced ATS Analysis
    const debouncedAnalysis = useCallback(
        debounce((data) => {
            setAtsResult(analyzeResume(data));
        }, 500),
        []
    );

    useEffect(() => {
        debouncedAnalysis(resumeData);
        return () => debouncedAnalysis.cancel();
    }, [resumeData, debouncedAnalysis]);

    useEffect(() => {
        if (currentUser) {
            setResumeData(prev => ({
                ...prev,
                name: currentUser.displayName || prev.name,
                email: currentUser.email || prev.email,
                phone: currentUser.phoneNumber || prev.phone,
            }));
        }
    }, [currentUser]);

    const handleInputChange = useCallback((field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    }, []);

    const handleArrayChange = useCallback((field, index, subField, value) => {
        setResumeData(prev => {
            const updatedArray = [...prev[field]];
            updatedArray[index] = { ...updatedArray[index], [subField]: value };
            return { ...prev, [field]: updatedArray };
        });
        setErrors(prev => ({ ...prev, [`${field}-${index}-${subField}`]: undefined }));
    }, []);

    const handleAddSection = useCallback((field, initialValue) => {
        setResumeData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), initialValue]
        }));
    }, []);

    const handleRemoveSection = useCallback((field, index) => {
        setResumeData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    }, []);

    const validateStep = useCallback((step) => {
        const newErrors = {};

        switch (step) {
            case 0:
                if (!resumeData.name?.trim()) newErrors.name = "Name is required";
                if (!resumeData.email?.trim()) newErrors.email = "Email is required";
                if (!resumeData.phone?.trim()) newErrors.phone = "Phone is required";
                break;
            case 1:
                resumeData.experience?.forEach((exp, index) => {
                    if (!exp.company?.trim()) newErrors[`experience-${index}-company`] = "Company is required";
                    if (!exp.position?.trim()) newErrors[`experience-${index}-position`] = "Position is required";
                });
                break;
            case 2:
                resumeData.education?.forEach((edu, index) => {
                    if (!edu.institution?.trim()) newErrors[`education-${index}-institution`] = "Institution is required";
                    if (!edu.degree?.trim()) newErrors[`education-${index}-degree`] = "Degree is required";
                });
                break;
            case 4:
                resumeData.projects?.forEach((proj, index) => {
                    if (!proj.title?.trim()) newErrors[`projects-${index}-title`] = "Title is required";
                    if (!proj.description?.trim()) newErrors[`projects-${index}-description`] = "Description is required";
                });
                break;
            default:
                break;
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
            const input = document.getElementById("resume-content");
            if (!input) {
                throw new Error("Resume content element not found!");
            }

            const clone = input.cloneNode(true);
            clone.style.width = "210mm";
            clone.style.minHeight = "297mm";
            clone.style.position = "absolute";
            clone.style.left = "-9999px";
            clone.style.top = "0";
            clone.style.transform = "none";
            clone.style.backgroundColor = THEMES[theme].background;
            document.body.appendChild(clone);

            if (dynamicAtsFriendly) {
                const headers = clone.querySelectorAll("h2, h3");
                headers.forEach(header => {
                    header.style.fontWeight = "bold";
                    header.style.marginBottom = "8px";
                });

                const responsibilities = clone.querySelectorAll(".responsibilities");
                responsibilities.forEach(resp => {
                    const text = resp.textContent;
                    resp.innerHTML = text.split("\n")
                        .filter(t => t.trim())
                        .map(t => `• ${t.trim()}`)
                        .join("<br>");
                });
            }

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

            if (styledPdf) {
                clone.style.fontFamily = "'Arial', sans-serif";
                clone.style.color = "#333";
                clone.querySelectorAll(".section-title").forEach(title => {
                    title.style.color = TEMPLATES[activeTemplate].colors[0];
                    title.style.borderBottom = `2px solid ${TEMPLATES[activeTemplate].colors[1]}`;
                    title.style.paddingBottom = "4px";
                });
            }

            const scale = 2;
            const margin = 0;
            const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
            const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;

            const canvas = await html2canvas(clone, {
                scale,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: THEMES[theme].background,
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
                    margin - position,
                    imgWidth,
                    imgHeight,
                    undefined,
                    "FAST"
                );

                position += pageHeight;
                pageNumber++;
            }

            const fileName = resumeData.name
                ?.trim()
                .replace(/\s+/g, '_')
                .replace(/[^\w-]/g, '') || 'Resume';

            pdf.save(`${fileName}.pdf`);
            document.body.removeChild(clone);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const onDragEnd = useCallback((result) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
    }, [sections]);

    const handleTemplateChange = useCallback((template) => {
        setActiveTemplate(template);
        document.documentElement.style.setProperty('--primary-color', TEMPLATES[template].colors[0]);
        document.documentElement.style.setProperty('--secondary-color', TEMPLATES[template].colors[1]);
    }, []);

    const renderSectionContent = useCallback((section, data) => {
        switch(section.id) {
            case 'summary-1':
                return data.summary && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaUser className="me-2" />Professional Summary</h2>
                        <Card className="p-3 bg-light">
                            <p className="mb-0">{data.summary}</p>
                        </Card>
                    </section>
                );
            case 'experience-2':
                return data.experience?.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaBriefcase className="me-2" />Experience</h2>
                        {data.experience.map((exp, index) => (
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
                return data.education?.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaGraduationCap className="me-2" />Education</h2>
                        {data.education.map((edu, index) => (
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
                return data.skills?.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaCode className="me-2" />Skills</h2>
                        <Card className="p-3 bg-light">
                            <div className="d-flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <Badge key={index} bg="primary" className="p-2">{skill}</Badge>
                                ))}
                            </div>
                        </Card>
                    </section>
                );
            case 'certifications-5':
                return data.certifications?.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaAward className="me-2" />Certifications</h2>
                        <Card className="p-3 bg-light">
                            <ul className="mb-0">
                                {data.certifications.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </Card>
                    </section>
                );
            case 'projects-6':
                return data.projects?.length > 0 && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaCode className="me-2" />Projects</h2>
                        {data.projects.map((proj, index) => (
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
                return data.achievements && (
                    <section className="resume-section mb-4">
                        <h2 className="section-title"><FaAward className="me-2" />Achievements</h2>
                        <Card className="p-3 bg-light">
                            <p className="mb-0">{data.achievements}</p>
                        </Card>
                    </section>
                );
            default:
                return null;
        }
    }, []);

    return (
        <Container fluid className={`resume-generator-container ${darkMode ? 'dark-mode' : ''}`}>
            <StatusBar completion={completionPercentage} status={autoSaveStatus} />

            <FloatingControls
                template={activeTemplate}
                styledPdf={styledPdf}
                dynamicAtsFriendly={dynamicAtsFriendly}
                onToggleStyled={() => setStyledPdf(prev => !prev)}
                onToggleAts={() => setDynamicAtsFriendly(prev => !prev)}
                onOpenSettings={() => setShowSettings(true)}
                onOpenHelp={() => setShowHelp(true)}
            />

            <Row className="g-4">
                <Col lg={3}>
                    <StepNavigation currentStep={currentStep} onStepChange={setCurrentStep} />
                </Col>

                <Col lg={9}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 0 && (
                                <PersonalInfoStep
                                    data={resumeData}
                                    errors={errors}
                                    onChange={handleInputChange}
                                />
                            )}
                            {currentStep === 1 && (
                                <ExperienceStep
                                    data={resumeData.experience}
                                    errors={errors}
                                    onArrayChange={handleArrayChange}
                                    onAdd={handleAddSection}
                                    onRemove={handleRemoveSection}
                                />
                            )}
                            {currentStep === 2 && (
                                <EducationStep
                                    data={resumeData.education}
                                    errors={errors}
                                    onArrayChange={handleArrayChange}
                                    onAdd={handleAddSection}
                                    onRemove={handleRemoveSection}
                                />
                            )}
                            {currentStep === 3 && (
                                <SkillsStep
                                    data={resumeData}
                                    onChange={handleInputChange}
                                />
                            )}
                            {currentStep === 4 && (
                                <ProjectsStep
                                    data={resumeData.projects}
                                    errors={errors}
                                    onArrayChange={handleArrayChange}
                                    onAdd={handleAddSection}
                                    onRemove={handleRemoveSection}
                                />
                            )}
                            {currentStep === 5 && (
                                <AchievementsStep
                                    data={resumeData}
                                    onChange={handleInputChange}
                                />
                            )}
                            {currentStep === 6 && (
                                <ResumePreview
                                    data={resumeData}
                                    template={activeTemplate}
                                    theme={theme}
                                    layout={layout}
                                    scale={{ value: previewScale, set: setPreviewScale }}
                                    sections={sections}
                                    onDragEnd={onDragEnd}
                                    renderSection={renderSectionContent}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="navigation-buttons mt-4 d-flex justify-content-between">
                        <div>
                            {currentStep > 0 && (
                                <Button variant="secondary" onClick={() => handleStepChange("prev")}>
                                    <FaArrowLeft className="me-2" /> Previous
                                </Button>
                            )}
                        </div>
                        <div>
                            {currentStep < STEPS.length - 1 && (
                                <Button variant="primary" onClick={() => handleStepChange("next")}>
                                    Next <FaArrowRight className="ms-2" />
                                </Button>
                            )}
                            {currentStep === STEPS.length - 1 && (
                                <Button
                                    variant="success"
                                    onClick={handleGeneratePDF}
                                    disabled={isGeneratingPDF}
                                >
                                    {isGeneratingPDF ? (
                                        "Generating..."
                                    ) : (
                                        <>
                                            <FaFilePdf className="me-2" /> Download PDF
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {atsResult && <ATSDashboard results={atsResult} darkMode={darkMode} />}
                </Col>
            </Row>

            {/* Settings Modal */}
            <Modal show={showSettings} onHide={() => setShowSettings(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title><FaCog className="me-2" />Resume Settings</Modal.Title>
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
                                {Object.entries(TEMPLATES).map(([key, template]) => (
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
                                {Object.keys(THEMES).map(key => (
                                    <option key={key} value={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center">
                                <FaPalette className="me-2" /> Styled PDF Template
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <ReactSwitch
                                    checked={styledPdf}
                                    onChange={() => setStyledPdf(!styledPdf)}
                                    onColor="#2c3e50"
                                    offColor="#adb5bd"
                                />
                                <span className="ms-3 text-muted">
                                    Apply custom fonts, colors, and layouts for a polished look
                                </span>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center">
                                <FaMagic className="me-2" /> ATS-Friendly Formatting
                            </Form.Label>
                            <div className="d-flex align-items-center">
                                <ReactSwitch
                                    checked={dynamicAtsFriendly}
                                    onChange={() => setDynamicAtsFriendly(!dynamicAtsFriendly)}
                                    onColor="#2c3e50"
                                    offColor="#adb5bd"
                                />
                                <span className="ms-3 text-muted">
                                    Ensure structured headers, bullet points, and proper keyword placement
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
                    <Modal.Title><FaQuestionCircle className="me-2" />Resume Builder Help</Modal.Title>
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
                        <li>Keep your professional summary concise and focused (150-200 words recommended)</li>
                        <li>Tailor your resume to the job you're applying for</li>
                        <li>Include relevant keywords from the job description</li>
                    </ul>

                    <h5 className="mt-4">ATS Optimization</h5>
                    <p>
                        The ATS (Applicant Tracking System) dashboard shows how well your resume matches common job requirements.
                        Aim for scores above 70% in all categories for the best results.
                    </p>

                    <h5 className="mt-4">Keyboard Shortcuts</h5>
                    <ul>
                        <li><kbd>Ctrl/Cmd + S</kbd> - Save resume</li>
                        <li><kbd>Ctrl/Cmd + P</kbd> - Generate PDF</li>
                        <li><kbd>Ctrl/Cmd + →</kbd> - Next step</li>
                        <li><kbd>Ctrl/Cmd + ←</kbd> - Previous step</li>
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