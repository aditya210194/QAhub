// MentorshipPage.js - Complete Working Version with Compact Hero and Horizontal Cards
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaComments,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaArrowLeft,
    FaArrowRight,
    FaCheck,
    FaRobot,
    FaLinkedin,
    FaClock,
    FaStar,
    FaGraduationCap,
    FaCode,
    FaBullseye,
    FaRocket,
    FaPaperPlane,
    FaRegSmile,
    FaUserTie,
    FaUsers,
    FaChartLine,
    FaHandsHelping,
    FaPaperclip,
    FaImage,
    FaFileCode,
    FaFileAlt,
    FaMicrophone,
    FaTimes,
    FaCopy,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaThumbsUp,
    FaThumbsDown,
    FaRegCommentDots,
    FaRegFileCode,
    FaPalette,
    FaBold,
    FaItalic,
    FaListUl,
    FaListOl,
    FaCode as FaCodeBlock,
    FaQuoteRight,
    FaLink,
    FaRegTrashAlt,
    FaShareAlt,
    FaHourglassHalf,
    FaBan,
    FaSyncAlt
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MentorshipPage.css';
import { Helmet } from 'react-helmet-async';

// Custom components for markdown rendering
// Custom components for markdown rendering
const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        const codeString = String(children).replace(/\n$/, '');

        return !inline && language ? (
            <div className="code-block-wrapper">
                <div className="code-block-header">
                    <span className="code-language">{language}</span>
                    <button
                        className="copy-code-btn"
                        onClick={() => navigator.clipboard.writeText(codeString)}
                    >
                        <FaCopy /> Copy
                    </button>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="code-block"
                    {...props}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="inline-code" {...props}>
                {children}
            </code>
        )
    },
    h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
    p: ({ children }) => <p className="markdown-p">{children}</p>,
    ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
    ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
    li: ({ children }) => <li className="markdown-li">{children}</li>,
    blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">{children}</a>,
    table: ({ children }) => <table className="markdown-table">{children}</table>,
    th: ({ children }) => <th className="markdown-th">{children}</th>,
    td: ({ children }) => <td className="markdown-td">{children}</td>,
};

const MentorshipPage = () => {
    // State management
    const [selectedRole, setSelectedRole] = useState('');
    const [mentorForm, setMentorForm] = useState({
        expertise: '',
        experience: '',
        availability: '',
        linkedIn: '',
        bio: '',
        hourlyRate: '',
        certifications: ''
    });
    const [menteeForm, setMenteeForm] = useState({
        learningGoals: '',
        currentSkills: '',
        desiredSkills: '',
        timeCommitment: '',
        preferredLanguage: '',
        background: '',
        expectations: ''
    });
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('selection');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showFormattingBar, setShowFormattingBar] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Application status states
    const [applicationStatus, setApplicationStatus] = useState({
        mentor: null,
        mentee: null,
        mentorDetails: null,
        menteeDetails: null,
        loading: true,
        error: null
    });
    const [showStatusPage, setShowStatusPage] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Refs
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const codeInputRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const textareaRef = useRef(null);
    const navigate = useNavigate();

    // Get status color and icon
    const getStatusInfo = (status) => {
        switch(status) {
            case 'pending':
                return { color: '#f59e0b', icon: <FaHourglassHalf />, text: 'Pending Review', bgColor: '#fef3c7' };
            case 'approved':
                return { color: '#10b981', icon: <FaCheckCircle />, text: 'Approved', bgColor: '#d1fae5' };
            case 'rejected':
                return { color: '#ef4444', icon: <FaBan />, text: 'Not Approved', bgColor: '#fee2e2' };
            default:
                return { color: '#6b7280', icon: null, text: 'Not Applied', bgColor: '#f3f4f6' };
        }
    };

    // Check existing applications
    const checkApplicationStatus = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setIsRefreshing(true);
            }

            const token = sessionStorage.getItem('token');
            if (!token) {
                setApplicationStatus(prev => ({
                    ...prev,
                    loading: false,
                    error: null
                }));
                return;
            }

            const [mentorResponse, menteeResponse] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/mentorship/mentor-application-status`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => ({
                    data: { status: null, error: err.response?.data?.error || 'Failed to fetch' }
                })),
                axios.get(`${process.env.REACT_APP_API_URL}/api/mentorship/mentee-application-status`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => ({
                    data: { status: null, error: err.response?.data?.error || 'Failed to fetch' }
                }))
            ]);

            const statusData = {
                mentor: mentorResponse.data?.status || null,
                mentee: menteeResponse.data?.status || null,
                mentorDetails: mentorResponse.data,
                menteeDetails: menteeResponse.data,
                lastChecked: new Date().toISOString()
            };

            localStorage.setItem('mentorshipApplicationStatus', JSON.stringify(statusData));

            setApplicationStatus({
                mentor: mentorResponse.data?.status || null,
                mentee: menteeResponse.data?.status || null,
                mentorDetails: mentorResponse.data,
                menteeDetails: menteeResponse.data,
                loading: false,
                error: null
            });
        } catch (err) {
            console.error('Error checking application status:', err);
            const cachedStatus = localStorage.getItem('mentorshipApplicationStatus');
            if (cachedStatus) {
                const parsed = JSON.parse(cachedStatus);
                setApplicationStatus({
                    mentor: parsed.mentor,
                    mentee: parsed.mentee,
                    mentorDetails: parsed.mentorDetails,
                    menteeDetails: parsed.menteeDetails,
                    loading: false,
                    error: 'Using cached data. Please refresh.'
                });
            } else {
                setApplicationStatus(prev => ({
                    ...prev,
                    loading: false,
                    error: err.response?.data?.message || 'Failed to load application status'
                }));
            }
        } finally {
            if (showLoading) {
                setIsRefreshing(false);
            }
        }
    }, []);

    // Load status on component mount
    useEffect(() => {
        const cachedStatus = localStorage.getItem('mentorshipApplicationStatus');
        if (cachedStatus) {
            const parsed = JSON.parse(cachedStatus);
            setApplicationStatus({
                mentor: parsed.mentor,
                mentee: parsed.mentee,
                mentorDetails: parsed.mentorDetails,
                menteeDetails: parsed.menteeDetails,
                loading: false,
                error: null
            });
        }
        checkApplicationStatus(true);
        const interval = setInterval(() => {
            if (!showStatusPage) {
                checkApplicationStatus(false);
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [checkApplicationStatus, showStatusPage]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [chatMessage]);

    // Load/save conversation
    useEffect(() => {
        const savedConversation = localStorage.getItem('aiConversation');
        if (savedConversation && activeTab === 'ai') {
            try {
                const parsed = JSON.parse(savedConversation);
                setChatHistory(parsed);
            } catch (e) {
                console.error('Failed to load conversation:', e);
            }
        }
    }, [activeTab]);

    useEffect(() => {
        if (chatHistory.length > 0 && activeTab === 'ai') {
            localStorage.setItem('aiConversation', JSON.stringify(chatHistory));
        }
    }, [chatHistory, activeTab]);

    // Role selection handler
    const handleRoleSelection = useCallback((role) => {
        if (role === 'mentor' && applicationStatus.mentor && applicationStatus.mentor !== 'rejected') {
            setShowStatusPage(true);
            setError(`You have already submitted a mentor application (Status: ${applicationStatus.mentor}). View your status below.`);
            return;
        }
        if (role === 'mentee' && applicationStatus.mentee && applicationStatus.mentee !== 'rejected') {
            setShowStatusPage(true);
            setError(`You have already submitted a mentee application (Status: ${applicationStatus.mentee}). View your status below.`);
            return;
        }
        setSelectedRole(role);
        setError('');
        setActiveTab(role);
        setShowStatusPage(false);
    }, [applicationStatus]);

    // Form handlers
    const handleMentorChange = useCallback((e) => {
        setMentorForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleMenteeChange = useCallback((e) => {
        setMenteeForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    // Form submissions
    const handleMentorSubmit = async (e) => {
        e.preventDefault();
        if (applicationStatus.mentor && applicationStatus.mentor !== 'rejected') {
            setError(`You have already submitted a mentor application (Status: ${applicationStatus.mentor}). Only one application is allowed.`);
            setShowStatusPage(true);
            return;
        }
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/mentorship/apply-mentor`, mentorForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newStatus = {
                mentor: 'pending',
                mentee: applicationStatus.mentee,
                mentorDetails: { status: 'pending', ...response.data },
                menteeDetails: applicationStatus.menteeDetails,
                lastChecked: new Date().toISOString()
            };
            localStorage.setItem('mentorshipApplicationStatus', JSON.stringify(newStatus));
            setApplicationStatus(prev => ({
                ...prev,
                mentor: 'pending',
                mentorDetails: { status: 'pending', ...response.data },
                loading: false
            }));
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowStatusPage(true);
                setSelectedRole('');
                setActiveTab('selection');
            }, 3000);
        } catch (err) {
            if (err.response?.status === 409) {
                setError('You have already submitted an application. Please check your status.');
                setShowStatusPage(true);
                setSelectedRole('');
                setActiveTab('selection');
                checkApplicationStatus(true);
            } else {
                setError(err.response?.data?.message || 'Error submitting mentor application');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMenteeSubmit = async (e) => {
        e.preventDefault();
        if (applicationStatus.mentee && applicationStatus.mentee !== 'rejected') {
            setError(`You have already submitted a mentee application (Status: ${applicationStatus.mentee}). Only one application is allowed.`);
            setShowStatusPage(true);
            return;
        }
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/mentorship/apply-mentee`, menteeForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newStatus = {
                mentor: applicationStatus.mentor,
                mentee: 'pending',
                mentorDetails: applicationStatus.mentorDetails,
                menteeDetails: { status: 'pending', ...response.data },
                lastChecked: new Date().toISOString()
            };
            localStorage.setItem('mentorshipApplicationStatus', JSON.stringify(newStatus));
            setApplicationStatus(prev => ({
                ...prev,
                mentee: 'pending',
                menteeDetails: { status: 'pending', ...response.data },
                loading: false
            }));
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowStatusPage(true);
                setSelectedRole('');
                setActiveTab('selection');
            }, 3000);
        } catch (err) {
            if (err.response?.status === 409) {
                setError('You have already submitted an application. Please check your status.');
                setShowStatusPage(true);
                setSelectedRole('');
                setActiveTab('selection');
                checkApplicationStatus(true);
            } else {
                setError(err.response?.data?.message || 'Error submitting mentee application');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // File upload handlers
    const simulateUpload = useCallback((fileId) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setAttachedFiles(prev =>
                prev.map(f => f.id === fileId ? { ...f, progress, status: progress >= 100 ? 'uploaded' : 'uploading' } : f)
            );
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const handleFileUpload = useCallback((event, type) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            type,
            name: file.name,
            size: file.size,
            preview: type === 'image' ? URL.createObjectURL(file) : null,
            status: 'pending',
            progress: 0
        }));
        setAttachedFiles(prev => [...prev, ...newFiles]);
        newFiles.forEach(fileObj => {
            simulateUpload(fileObj.id);
        });
        event.target.value = '';
    }, [simulateUpload]);

    const removeFile = useCallback((fileId) => {
        setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
    }, []);

    // Message actions
    const copyToClipboard = useCallback((text) => {
        navigator.clipboard.writeText(text);
        setError('Copied to clipboard!');
        setTimeout(() => setError(''), 2000);
    }, []);

    const addMessageFeedback = useCallback((messageId, feedback) => {
        console.log(`Feedback for message ${messageId}: ${feedback}`);
    }, []);

    const deleteMessage = useCallback((messageId) => {
        setChatHistory(prev => prev.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);
    }, []);

    const shareConversation = useCallback(() => {
        const conversationText = chatHistory.map(msg =>
            `${msg.type === 'ai' ? 'AI Mentor' : 'You'}: ${msg.content}`
        ).join('\n\n');
        navigator.clipboard.writeText(conversationText);
        setShowShareModal(false);
        setError('Conversation copied to clipboard!');
        setTimeout(() => setError(''), 2000);
    }, [chatHistory]);

    const clearConversation = useCallback(() => {
        if (window.confirm('Are you sure you want to clear the conversation history?')) {
            setChatHistory([]);
            localStorage.removeItem('aiConversation');
            setError('Conversation cleared!');
            setTimeout(() => setError(''), 2000);
        }
    }, []);

    // AI Chat handler
    const handleChatSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!chatMessage.trim() && attachedFiles.length === 0) return;

        const userMessageId = `msg-${Date.now()}`;
        const userMessage = {
            id: userMessageId,
            type: 'user',
            content: chatMessage,
            attachments: attachedFiles.map(f => ({
                name: f.name,
                type: f.type,
                size: f.size,
                preview: f.preview
            })),
            timestamp: new Date().toISOString()
        };

        setChatHistory(prev => [...prev, userMessage]);
        const userQuestion = chatMessage;
        const files = attachedFiles;

        setChatMessage('');
        setAttachedFiles([]);
        setIsLoading(true);
        setError('');

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('question', userQuestion);
            formData.append('conversationId', conversationId || '');
            files.forEach(file => {
                formData.append('files', file.file);
            });

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/ai-mentor/response-with-files`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setConversationId(response.data.conversationId);

            const aiMessage = {
                id: `msg-${Date.now()}-ai`,
                type: 'ai',
                content: response.data.response,
                attachments: response.data.attachments || [],
                timestamp: new Date().toISOString()
            };

            setChatHistory(prev => [...prev, aiMessage]);

        } catch (err) {
            console.error('Error calling AI mentor:', err);
            const errorMessage = err.response?.data?.error || 'Error communicating with AI mentor. Please try again.';
            setError(errorMessage);
            setChatHistory(prev => [...prev, {
                id: `msg-${Date.now()}-error`,
                type: 'ai',
                content: 'Sorry, I encountered an error. Please try again in a moment.',
                isError: true,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [chatMessage, attachedFiles, conversationId, navigate]);

    // Suggested questions
    const suggestedQuestions = useMemo(() => [
        { text: "What skills do I need for automation testing?", icon: <FaCode />, color: "#4299e1" },
        { text: "How do I prepare for ISTQB certification?", icon: <FaGraduationCap />, color: "#48bb78" },
        { text: "What's the best way to start learning testing?", icon: <FaRocket />, color: "#ed8936" },
        { text: "Can you review this code?", icon: <FaRegFileCode />, color: "#9f7aea" },
        { text: "What are the latest trends in QA?", icon: <FaChartLine />, color: "#f56565" },
        { text: "How to transition from manual to automation?", icon: <FaArrowRight />, color: "#4299e1" }
    ], []);

    const handleSuggestedQuestion = useCallback((question) => {
        setChatMessage(question);
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            handleChatSubmit(fakeEvent);
        }, 100);
    }, [handleChatSubmit]);

    // Voice input
    const handleVoiceInput = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setIsRecording(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setChatMessage(prev => prev + (prev ? ' ' : '') + transcript);
            setIsRecording(false);
        };
        recognition.onerror = () => {
            setIsRecording(false);
            setError('Voice recognition failed. Please try again.');
            setTimeout(() => setError(''), 3000);
        };
        recognition.onend = () => {
            setIsRecording(false);
        };
        recognition.start();
    }, []);

    // Formatting helpers
    const insertFormatting = useCallback((before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = chatMessage.substring(start, end);
        const newText = chatMessage.substring(0, start) + before + selectedText + after + chatMessage.substring(end);
        setChatMessage(newText);
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [chatMessage]);

    const formatTime = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }, []);

    const handleBack = useCallback(() => {
        setSelectedRole('');
        setActiveTab('selection');
        setError('');
        setChatHistory([]);
        setAttachedFiles([]);
        setConversationId(null);
        setShowStatusPage(false);
    }, []);

    // Status Page Component
    const StatusPage = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="status-page"
        >
            <div className="status-header">
                <FaHandsHelping className="status-header-icon" />
                <h2>Your Application Status</h2>
                <p>Track the progress of your mentorship applications</p>
                <button
                    className="refresh-status-btn"
                    onClick={() => checkApplicationStatus(true)}
                    disabled={isRefreshing}
                >
                    <FaSyncAlt className={isRefreshing ? 'spinning' : ''} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
                </button>
            </div>
            <div className="status-cards">
                <div className="status-card">
                    <div className="status-card-header">
                        <FaChalkboardTeacher className="status-role-icon mentor-icon" />
                        <h3>Mentor Application</h3>
                    </div>
                    <div className="status-content">
                        <div className="status-badge" style={{ backgroundColor: getStatusInfo(applicationStatus.mentor).bgColor, color: getStatusInfo(applicationStatus.mentor).color }}>
                            {getStatusInfo(applicationStatus.mentor).icon}
                            <span>{getStatusInfo(applicationStatus.mentor).text}</span>
                        </div>
                        {applicationStatus.mentor === 'pending' && (
                            <div className="status-message">
                                <FaClock />
                                <p>Your application is being reviewed by our team. We'll notify you once a decision is made.</p>
                                <small>Applied on: {new Date(applicationStatus.mentorDetails?.appliedAt).toLocaleDateString()}</small>
                            </div>
                        )}
                        {applicationStatus.mentor === 'approved' && (
                            <div className="status-message success">
                                <FaCheckCircle />
                                <p>Congratulations! Your mentor application has been approved. You can now start mentoring.</p>
                            </div>
                        )}
                        {applicationStatus.mentor === 'rejected' && (
                            <div className="status-message error">
                                <FaExclamationTriangle />
                                <p>Your application was not approved at this time. You can submit a new application.</p>
                                <button className="apply-btn mentor-btn" onClick={() => handleRoleSelection('mentor')}>
                                    Apply Again <FaArrowRight />
                                </button>
                            </div>
                        )}
                        {!applicationStatus.mentor && (
                            <div className="status-message">
                                <FaRegSmile />
                                <p>You haven't applied as a mentor yet. Click below to start your journey!</p>
                                <button className="apply-btn mentor-btn" onClick={() => handleRoleSelection('mentor')}>
                                    Apply as Mentor <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="status-card">
                    <div className="status-card-header">
                        <FaUserGraduate className="status-role-icon mentee-icon" />
                        <h3>Mentee Application</h3>
                    </div>
                    <div className="status-content">
                        <div className="status-badge" style={{ backgroundColor: getStatusInfo(applicationStatus.mentee).bgColor, color: getStatusInfo(applicationStatus.mentee).color }}>
                            {getStatusInfo(applicationStatus.mentee).icon}
                            <span>{getStatusInfo(applicationStatus.mentee).text}</span>
                        </div>
                        {applicationStatus.mentee === 'pending' && (
                            <div className="status-message">
                                <FaClock />
                                <p>Your application is being reviewed. We'll match you with a mentor soon!</p>
                                <small>Applied on: {new Date(applicationStatus.menteeDetails?.appliedAt).toLocaleDateString()}</small>
                            </div>
                        )}
                        {applicationStatus.mentee === 'approved' && (
                            <div className="status-message success">
                                <FaCheckCircle />
                                <p>Great news! Your mentee application has been approved. You'll be matched with a mentor shortly.</p>
                            </div>
                        )}
                        {applicationStatus.mentee === 'rejected' && (
                            <div className="status-message error">
                                <FaExclamationTriangle />
                                <p>Your application was not approved. You can submit a new application.</p>
                                <button className="apply-btn mentee-btn" onClick={() => handleRoleSelection('mentee')}>
                                    Apply Again <FaArrowRight />
                                </button>
                            </div>
                        )}
                        {!applicationStatus.mentee && (
                            <div className="status-message">
                                <FaRegSmile />
                                <p>Ready to grow your skills? Apply as a mentee today!</p>
                                <button className="apply-btn mentee-btn" onClick={() => handleRoleSelection('mentee')}>
                                    Apply as Mentee <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="status-actions">
                <button className="btn-secondary" onClick={() => {
                    setShowStatusPage(false);
                    setActiveTab('selection');
                }}>
                    Back to Selection
                </button>
                <button className="btn-primary" onClick={() => {
                    setShowStatusPage(false);
                    handleRoleSelection('ai');
                }}>
                    Chat with AI Mentor <FaRobot />
                </button>
            </div>
        </motion.div>
    );

    if (applicationStatus.loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your application status...</p>
            </div>
        );
    }

    return (
        <div className="mentorship-page">
            <Helmet>
                <title>QA Mentorship Program | QA Hub</title>
                <meta name="description" content="Get 1-on-1 mentorship from experienced QA engineers. Accelerate your software testing career with personalized guidance on QA Hub." />
                <meta property="og:title" content="QA Mentorship Program | QA Hub" />
                <meta property="og:description" content="1-on-1 mentorship from experienced QA engineers to accelerate your career." />
                <meta property="og:url" content="https://www.qahub.co.in/mentorship" />
            </Helmet>
            {/* Compact Hero Section */}

            <motion.div
                className="mentorship-hero-compact"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="hero-content-compact">
                    <h1 className="hero-title-compact">
                        <FaHandsHelping className="hero-icon-compact" />
                        Mentorship Program
                    </h1>
                    <p className="hero-subtitle-compact">
                        Connect with industry experts, grow your skills, and advance your career
                    </p>
                </div>
            </motion.div>

            <div className="container py-3">
            <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Back</button>
                <AnimatePresence mode="wait">
                    {showSuccess && (
                        <motion.div
                            className="success-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="success-card">
                                <FaCheck className="success-icon" />
                                <h3>Application Submitted!</h3>
                                <p>Your application is being reviewed. Check your status on the status page.</p>
                            </div>
                        </motion.div>
                    )}

                    {showStatusPage ? (
                        <StatusPage />
                    ) : (
                        <motion.div
                            className="mentorship-card-compact"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Selection Cards - Horizontal Layout */}
                            {activeTab === 'selection' && !selectedRole && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="selection-section-compact"
                                >
                                    <div className="status-indicator-compact">
                                        <button
                                            className="view-status-btn-compact"
                                            onClick={() => setShowStatusPage(true)}
                                        >
                                            <FaChartLine /> View My Status
                                            {(applicationStatus.mentor || applicationStatus.mentee) && (
                                                <span className="status-dot-indicator"></span>
                                            )}
                                        </button>
                                    </div>

                                    <h2 className="section-title-compact">Choose Your Path</h2>

                                    <div className="role-cards-horizontal-wrapper">
                                        <div className="role-cards-horizontal">
                                            {/* Mentor Card */}
                                            <motion.div
                                                className={`role-card-horizontal mentor-card ${applicationStatus.mentor && applicationStatus.mentor !== 'rejected' ? 'disabled' : ''}`}
                                                whileHover={{ scale: 1.03, y: -3 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => (applicationStatus.mentor !== 'pending' && applicationStatus.mentor !== 'approved') && handleRoleSelection('mentor')}
                                            >
                                                <div className="role-icon-wrapper-horizontal">
                                                    <FaChalkboardTeacher className="role-icon-horizontal" />
                                                </div>
                                                <h3>Become a Mentor</h3>
                                                <p>Share your expertise and guide QA professionals</p>
                                                {applicationStatus.mentor && applicationStatus.mentor !== 'rejected' && (
                                                    <div className="applied-badge-horizontal">
                                                        {getStatusInfo(applicationStatus.mentor).icon}
                                                        <span>{getStatusInfo(applicationStatus.mentor).text}</span>
                                                    </div>
                                                )}
                                                <div className="role-features-horizontal">
                                                    <span><FaStar /> 100+ mentees</span>
                                                    <span><FaUsers /> Expert community</span>
                                                </div>
                                                <button className="role-btn-horizontal mentor-btn" disabled={!!(applicationStatus.mentor && applicationStatus.mentor !== 'rejected')}>
                                                    {(applicationStatus.mentor === 'pending' && 'Pending') ||
                                                     (applicationStatus.mentor === 'approved' && 'Approved') ||
                                                     (applicationStatus.mentor === 'rejected' && 'Apply') ||
                                                     'Apply'} <FaArrowRight />
                                                </button>
                                            </motion.div>

                                            {/* Mentee Card */}
                                            <motion.div
                                                className={`role-card-horizontal mentee-card ${applicationStatus.mentee && applicationStatus.mentee !== 'rejected' ? 'disabled' : ''}`}
                                                whileHover={{ scale: 1.03, y: -3 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => (applicationStatus.mentee !== 'pending' && applicationStatus.mentee !== 'approved') && handleRoleSelection('mentee')}
                                            >
                                                <div className="role-icon-wrapper-horizontal">
                                                    <FaUserGraduate className="role-icon-horizontal" />
                                                </div>
                                                <h3>Become a Mentee</h3>
                                                <p>Get personalized guidance from industry experts</p>
                                                {applicationStatus.mentee && applicationStatus.mentee !== 'rejected' && (
                                                    <div className="applied-badge-horizontal">
                                                        {getStatusInfo(applicationStatus.mentee).icon}
                                                        <span>{getStatusInfo(applicationStatus.mentee).text}</span>
                                                    </div>
                                                )}
                                                <div className="role-features-horizontal">
                                                    <span><FaStar /> 1-on-1 sessions</span>
                                                    <span><FaRocket /> Career growth</span>
                                                </div>
                                                <button className="role-btn-horizontal mentee-btn" disabled={!!(applicationStatus.mentee && applicationStatus.mentee !== 'rejected')}>
                                                    {(applicationStatus.mentee === 'pending' && 'Pending') ||
                                                     (applicationStatus.mentee === 'approved' && 'Approved') ||
                                                     (applicationStatus.mentee === 'rejected' && 'Register') ||
                                                     'Register'} <FaArrowRight />
                                                </button>
                                            </motion.div>

                                            {/* AI Card */}
                                            <motion.div
                                                className="role-card-horizontal ai-card"
                                                whileHover={{ scale: 1.03, y: -3 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRoleSelection('ai')}
                                            >
                                                <div className="role-icon-wrapper-horizontal">
                                                    <FaRobot className="role-icon-horizontal" />
                                                </div>
                                                <h3>AI Mentorship</h3>
                                                <p>Get instant answers from our AI mentor, 24/7</p>
                                                <div className="role-features-horizontal">
                                                    <span><FaComments /> Instant</span>
                                                    <span><FaClock /> 24/7 available</span>
                                                </div>
                                                <button className="role-btn-horizontal ai-btn">
                                                    Chat Now <FaArrowRight />
                                                </button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Mentor Form Section */}
                            {selectedRole === 'mentor' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="form-section"
                                >
                                    <div className="form-header">
                                        <button className="back-btn" onClick={handleBack}>
                                            <FaArrowLeft /> Back
                                        </button>
                                        <h3><FaChalkboardTeacher /> Mentor Application</h3>
                                    </div>
                                    <form onSubmit={handleMentorSubmit} className="mentorship-form">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label><FaStar /> Area of Expertise *</label>
                                                <select name="expertise" value={mentorForm.expertise} onChange={handleMentorChange} required>
                                                    <option value="">Select your expertise</option>
                                                    <option value="automation">Automation Testing</option>
                                                    <option value="manual">Manual Testing</option>
                                                    <option value="performance">Performance Testing</option>
                                                    <option value="security">Security Testing</option>
                                                    <option value="api">API Testing</option>
                                                    <option value="mobile">Mobile Testing</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label><FaChartLine /> Years of Experience *</label>
                                                <input type="number" name="experience" value={mentorForm.experience} onChange={handleMentorChange} min="0" max="50" required placeholder="e.g., 5" />
                                            </div>
                                            <div className="form-group">
                                                <label><FaClock /> Availability (hours/week) *</label>
                                                <input type="number" name="availability" value={mentorForm.availability} onChange={handleMentorChange} min="1" max="40" required placeholder="e.g., 5" />
                                            </div>
                                            <div className="form-group">
                                                <label><FaLinkedin /> LinkedIn Profile URL *</label>
                                                <input type="url" name="linkedIn" value={mentorForm.linkedIn} onChange={handleMentorChange} required placeholder="https://linkedin.com/in/username" />
                                            </div>
                                            <div className="form-group full-width">
                                                <label><FaUserTie /> Professional Bio *</label>
                                                <textarea name="bio" value={mentorForm.bio} onChange={handleMentorChange} required rows="4" placeholder="Tell us about your experience and what you can offer as a mentor..." />
                                            </div>
                                            <div className="form-group">
                                                <label><FaGraduationCap /> Certifications</label>
                                                <input type="text" name="certifications" value={mentorForm.certifications} onChange={handleMentorChange} placeholder="e.g., ISTQB, CSTE, etc." />
                                            </div>
                                            <div className="form-group">
                                                <label><FaRocket /> Hourly Rate ($/hour)</label>
                                                <input type="number" name="hourlyRate" value={mentorForm.hourlyRate} onChange={handleMentorChange} min="0" placeholder="e.g., 50" />
                                            </div>
                                        </div>
                                        {error && <div className="error-message">{error}</div>}
                                        <div className="form-actions">
                                            <button type="button" className="btn-secondary" onClick={handleBack}>Cancel</button>
                                            <button type="submit" className="btn-primary mentor-btn" disabled={isLoading || !!(applicationStatus.mentor && applicationStatus.mentor !== 'rejected')}>
                                                {isLoading ? <>Submitting <span className="spinner"></span></> : <>Submit Application <FaPaperPlane /></>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Mentee Form Section */}
                            {selectedRole === 'mentee' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="form-section"
                                >
                                    <div className="form-header">
                                        <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Back</button>
                                        <h3><FaUserGraduate /> Mentee Registration</h3>
                                    </div>
                                    <form onSubmit={handleMenteeSubmit} className="mentorship-form">
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label><FaBullseye /> Learning Goals *</label>
                                                <textarea name="learningGoals" value={menteeForm.learningGoals} onChange={handleMenteeChange} required rows="3" placeholder="What do you hope to achieve through mentorship?" />
                                            </div>
                                            <div className="form-group">
                                                <label><FaCode /> Current Skills *</label>
                                                <input type="text" name="currentSkills" value={menteeForm.currentSkills} onChange={handleMenteeChange} required placeholder="e.g., Manual Testing, Basic SQL" />
                                            </div>
                                            <div className="form-group">
                                                <label><FaRocket /> Desired Skills *</label>
                                                <input type="text" name="desiredSkills" value={menteeForm.desiredSkills} onChange={handleMenteeChange} required placeholder="e.g., Selenium, API Testing" />
                                            </div>
                                            <div className="form-group">
                                                <label><FaClock /> Time Commitment (hours/week) *</label>
                                                <select name="timeCommitment" value={menteeForm.timeCommitment} onChange={handleMenteeChange} required>
                                                    <option value="">Select commitment</option>
                                                    <option value="1-2">1-2 hours/week</option>
                                                    <option value="3-5">3-5 hours/week</option>
                                                    <option value="5-10">5-10 hours/week</option>
                                                    <option value="10+">10+ hours/week</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label><FaComments /> Preferred Language</label>
                                                <input type="text" name="preferredLanguage" value={menteeForm.preferredLanguage} onChange={handleMenteeChange} placeholder="e.g., English, Spanish" />
                                            </div>
                                            <div className="form-group full-width">
                                                <label><FaUserGraduate /> Professional Background</label>
                                                <textarea name="background" value={menteeForm.background} onChange={handleMenteeChange} rows="3" placeholder="Tell us about your professional background..." />
                                            </div>
                                            <div className="form-group full-width">
                                                <label><FaStar /> Expectations from Mentor</label>
                                                <textarea name="expectations" value={menteeForm.expectations} onChange={handleMenteeChange} rows="3" placeholder="What do you expect from your mentor?" />
                                            </div>
                                        </div>
                                        {error && <div className="error-message">{error}</div>}
                                        <div className="form-actions">
                                            <button type="button" className="btn-secondary" onClick={handleBack}>Cancel</button>
                                            <button type="submit" className="btn-primary mentee-btn" disabled={isLoading || !!(applicationStatus.mentee && applicationStatus.mentee !== 'rejected')}>
                                                {isLoading ? <>Submitting <span className="spinner"></span></> : <>Register as Mentee <FaPaperPlane /></>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* AI Chat Section */}
                            {selectedRole === 'ai' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="ai-chat-section"
                                >
                                    <div className="chat-header">
                                        <div className="chat-header-left">
                                            <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Back</button>
                                            <h3><FaRobot /> AI Mentor - 24/7 Available</h3>
                                        </div>
                                        <div className="chat-header-right">
                                            <div className="chat-status"><span className="status-dot"></span><span>Online</span></div>
                                            <div className="chat-actions">
                                                <button className="action-icon" onClick={clearConversation} title="Clear conversation"><FaRegTrashAlt /></button>
                                                <button className="action-icon" onClick={() => setShowShareModal(true)} title="Share conversation"><FaShareAlt /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-container">
                                        <div className="chat-messages" ref={chatMessagesRef}>
                                            {error && (<div className="error-message"><FaExclamationTriangle /><span>{error}</span></div>)}
                                            {chatHistory.length === 0 && (
                                                <div className="welcome-message">
                                                    <FaRobot className="welcome-icon" />
                                                    <h4>Welcome to AI Mentorship!</h4>
                                                    <p>Ask me anything about software testing, career advice, or technical concepts. You can also upload images, code files, or documents for better assistance!</p>
                                                    <div className="suggested-questions">
                                                        {suggestedQuestions.map((q, idx) => (<button key={idx} onClick={() => handleSuggestedQuestion(q.text)} style={{ backgroundColor: q.color }}>{q.icon} {q.text}</button>))}
                                                    </div>
                                                </div>
                                            )}
                                            {chatHistory.map((msg, index) => (
                                                <motion.div key={msg.id || index} className={`message ${msg.type} ${msg.isError ? 'error' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onContextMenu={(e) => { e.preventDefault(); setSelectedMessage(msg.id === selectedMessage ? null : msg.id); }}>
                                                    <div className="message-avatar">{msg.type === 'ai' ? <FaRobot /> : <FaUserGraduate />}</div>
                                                    <div className="message-content">
                                                        <div className="message-header-info"><strong>{msg.type === 'ai' ? 'AI Mentor' : 'You'}</strong><span className="message-time">{formatTime(msg.timestamp)}</span>{msg.edited && <span className="edited-badge">(edited)</span>}</div>
                                                        {msg.type === 'ai' ? (<ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{msg.content}</ReactMarkdown>) : (<div className="user-message">{msg.content}</div>)}
                                                        {msg.attachments && msg.attachments.length > 0 && (<div className="message-attachments">{msg.attachments.map((att, idx) => (<div key={idx} className="attachment-item">{att.type === 'image' && att.preview && <img src={att.preview} alt={att.name} className="attachment-image" onClick={() => window.open(att.preview, '_blank')} />}{att.type === 'code' && (<div className="attachment-code"><FaFileCode /><span>{att.name}</span><button onClick={() => copyToClipboard(att.content || '')}>Copy code</button></div>)}{att.type === 'file' && (<div className="attachment-file"><FaFileAlt /><span>{att.name}</span></div>)}</div>))}</div>)}
                                                        <div className="message-actions"><button onClick={() => copyToClipboard(msg.content)} title="Copy"><FaCopy /></button>{msg.type === 'ai' && (<><button onClick={() => addMessageFeedback(msg.id, 'helpful')} title="Helpful"><FaThumbsUp /></button><button onClick={() => addMessageFeedback(msg.id, 'not-helpful')} title="Not helpful"><FaThumbsDown /></button></>)}<button onClick={() => setSelectedMessage(msg.id)} title="More options"><FaRegCommentDots /></button></div>
                                                        {selectedMessage === msg.id && (<div className="message-context-menu"><button onClick={() => copyToClipboard(msg.content)}><FaCopy /> Copy</button><button onClick={() => deleteMessage(msg.id)}><FaRegTrashAlt /> Delete</button></div>)}
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {isLoading && (<div className="message ai typing"><div className="message-avatar"><FaRobot /></div><div className="message-content"><strong>AI Mentor</strong><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>)}
                                        </div>
                                        {showFormattingBar && (<div className="formatting-toolbar"><button onClick={() => insertFormatting('**', '**')} title="Bold"><FaBold /></button><button onClick={() => insertFormatting('*', '*')} title="Italic"><FaItalic /></button><button onClick={() => insertFormatting('```\n', '\n```')} title="Code Block"><FaCodeBlock /></button><button onClick={() => insertFormatting('- ', '')} title="Bullet List"><FaListUl /></button><button onClick={() => insertFormatting('1. ', '')} title="Numbered List"><FaListOl /></button><button onClick={() => insertFormatting('> ', '')} title="Quote"><FaQuoteRight /></button><button onClick={() => insertFormatting('[', '](url)')} title="Link"><FaLink /></button><button onClick={() => insertFormatting('`', '`')} title="Code"><FaCode /></button></div>)}
                                        {attachedFiles.length > 0 && (<div className="attached-files-preview">{attachedFiles.map(file => (<div key={file.id} className="file-preview-item">{file.type === 'image' && file.preview && <img src={file.preview} alt={file.name} className="file-preview-image" />}{file.type === 'code' && <FaFileCode className="file-preview-icon" />}{file.type === 'file' && <FaFileAlt className="file-preview-icon" />}<div className="file-preview-info"><span className="file-name">{file.name}</span><span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>{file.status === 'uploading' && (<div className="upload-progress"><div className="progress-bar" style={{ width: `${file.progress}%` }}></div></div>)}{file.status === 'uploaded' && <FaCheckCircle className="upload-success" />}</div><button className="remove-file" onClick={() => removeFile(file.id)}><FaTimes /></button></div>))}</div>)}
                                        <form onSubmit={handleChatSubmit} className="chat-input-form">
                                            <div className="input-actions">
                                                <button type="button" className="action-btn" onClick={() => fileInputRef.current.click()} title="Upload file"><FaPaperclip /></button>
                                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'file')} multiple />
                                                <button type="button" className="action-btn" onClick={() => imageInputRef.current.click()} title="Upload image"><FaImage /></button>
                                                <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} multiple />
                                                <button type="button" className="action-btn" onClick={() => codeInputRef.current.click()} title="Upload code file"><FaFileCode /></button>
                                                <input type="file" ref={codeInputRef} style={{ display: 'none' }} accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.txt" onChange={(e) => handleFileUpload(e, 'code')} multiple />
                                                <button type="button" className={`action-btn ${isRecording ? 'recording' : ''}`} onClick={handleVoiceInput} title="Voice input"><FaMicrophone /></button>
                                                <button type="button" className="action-btn" onClick={() => setShowFormattingBar(!showFormattingBar)} title="Formatting"><FaPalette /></button>
                                            </div>
                                            <textarea ref={textareaRef} className="chat-input" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Ask me anything about testing... You can also paste code or upload files!" disabled={isLoading} rows={1} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e); } }} />
                                            <button type="submit" className="send-btn" disabled={isLoading || (!chatMessage.trim() && attachedFiles.length === 0)}>{isLoading ? <FaSpinner className="spinner-icon" /> : <FaPaperPlane />}</button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header"><h3>Share Conversation</h3><button className="close-modal" onClick={() => setShowShareModal(false)}><FaTimes /></button></div>
                        <div className="modal-body"><p>Share this conversation with others? The content will be copied to your clipboard.</p></div>
                        <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowShareModal(false)}>Cancel</button><button className="btn-primary" onClick={shareConversation}><FaShareAlt /> Share</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorshipPage;