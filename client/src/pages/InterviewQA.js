import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Toast, Alert, Spinner } from 'react-bootstrap';
import {
    Bookmark,
    BookmarkCheck,
    Printer,
    Search,
    CheckCircle,
    Circle,
    ChevronDown,
    ChevronUp,
    X,
    Moon,
    Sun,
    Star,
    ArrowUp,
    Copy,
    Check,
    Maximize2,
    Minimize2,
    Code,
    FileText,
    Image,
    Table as TableIcon,
    List,
    Hash,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    Terminal,
    Cpu,
    Share2
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './InterviewQA.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Custom Hooks
const useInterviewData = (jsonFile) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/data/${jsonFile}`);
                if (!response.ok) throw new Error('Failed to load interview questions');
                const jsonData = await response.json();
                setData(jsonData);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error loading interview data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [jsonFile]);

    return { data, loading, error };
};

const useInterviewTracking = (questions) => {
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [answeredIds, setAnsweredIds] = useState([]);
    const [progress, setProgress] = useState(0);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        try {
            const savedBookmarks = JSON.parse(localStorage.getItem('interview_bookmarked') || '[]');
            const savedAnswered = JSON.parse(localStorage.getItem('interview_answered') || '[]');
            const savedRecentlyViewed = JSON.parse(localStorage.getItem('interview_recently_viewed') || '[]');

            if (Array.isArray(savedBookmarks)) setBookmarkedIds(savedBookmarks);
            if (Array.isArray(savedAnswered)) setAnsweredIds(savedAnswered);
            if (Array.isArray(savedRecentlyViewed)) setRecentlyViewed(savedRecentlyViewed.slice(0, 5));
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('interview_bookmarked', JSON.stringify(bookmarkedIds));
            localStorage.setItem('interview_answered', JSON.stringify(answeredIds));
            localStorage.setItem('interview_recently_viewed', JSON.stringify(recentlyViewed.slice(0, 5)));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [bookmarkedIds, answeredIds, recentlyViewed]);

    const toggleBookmark = useCallback((id) => {
        setBookmarkedIds(prev =>
            prev.includes(id) ? prev.filter(bookmarkId => bookmarkId !== id) : [...prev, id]
        );
    }, []);

    const toggleAnswered = useCallback((id) => {
        setAnsweredIds(prev =>
            prev.includes(id) ? prev.filter(ansId => ansId !== id) : [...prev, id]
        );
    }, []);

    const trackView = useCallback((question) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(item => item.id !== question.id);
            return [{ id: question.id, question: question.question }, ...filtered].slice(0, 5);
        });
    }, []);

    useEffect(() => {
        if (questions && answeredIds.length > 0) {
            setProgress(Math.round((answeredIds.length / questions.length) * 100));
        } else {
            setProgress(0);
        }
    }, [answeredIds, questions]);

    return {
        bookmarkedIds,
        answeredIds,
        recentlyViewed,
        progress,
        toggleBookmark,
        toggleAnswered,
        trackView,
        setRecentlyViewed
    };
};

// Utility Functions
const filterQuestions = (questions, searchTerm, selectedCategory, selectedDifficulty) => {
    if (!questions) return [];

    let filtered = [...questions];

    if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(q =>
            q.question.toLowerCase().includes(searchLower) ||
            (Array.isArray(q.answer)
                ? q.answer.some(step => step.toLowerCase().includes(searchLower))
                : q.answer.toLowerCase().includes(searchLower))
        );
    }

    if (selectedCategory !== 'All') {
        filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
        filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    return filtered;
};

// Advanced Answer Component
const AdvancedAnswer = ({ content, codeBlocks, diagrams, tables, darkMode }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [activeTab, setActiveTab] = useState('content');
    const [fontSize, setFontSize] = useState('medium');
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [wrapCode, setWrapCode] = useState(false);

    // Default empty arrays if props are undefined
    const safeCodeBlocks = codeBlocks || [];
    const safeDiagrams = diagrams || [];
    const safeTables = tables || [];

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const downloadCode = (code, filename) => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'code.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getFontSizeClass = () => {
        switch(fontSize) {
            case 'small': return 'font-small';
            case 'large': return 'font-large';
            default: return 'font-medium';
        }
    };

    const renderCodeBlock = (code, language, index, title) => {
        if (!code) return null;

        const syntaxStyle = darkMode ? vscDarkPlus : vs;

        return (
            <div className="code-block-container" key={index}>
                {title && <h5 className="code-title">{title}</h5>}
                <div className="code-toolbar">
                    <div className="code-info">
                        <Terminal size={16} />
                        <span className="language-badge">{language || 'text'}</span>
                    </div>
                    <div className="code-actions">
                        <button
                            className="code-action-btn"
                            onClick={() => setShowLineNumbers(!showLineNumbers)}
                            title="Toggle line numbers"
                        >
                            <Hash size={16} />
                        </button>
                        <button
                            className="code-action-btn"
                            onClick={() => setWrapCode(!wrapCode)}
                            title="Toggle word wrap"
                        >
                            {wrapCode ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                            className="code-action-btn"
                            onClick={() => downloadCode(code, `code-${index}.${language || 'txt'}`)}
                            title="Download code"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            className={`code-action-btn ${copiedIndex === index ? 'copied' : ''}`}
                            onClick={() => handleCopy(code, index)}
                            title="Copy code"
                        >
                            {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
                <div className={`code-content ${wrapCode ? 'wrap' : ''}`}>
                    <SyntaxHighlighter
                        language={language || 'javascript'}
                        style={syntaxStyle}
                        showLineNumbers={showLineNumbers}
                        wrapLines={wrapCode}
                        customStyle={{
                            margin: 0,
                            borderRadius: '0 0 8px 8px',
                            fontSize: fontSize === 'small' ? '12px' : fontSize === 'large' ? '16px' : '14px'
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            </div>
        );
    };

    const renderMarkdown = (markdown) => {
        if (!markdown) return null;

        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="markdown-code-block">
                                <SyntaxHighlighter
                                    language={match[1]}
                                    style={darkMode ? vscDarkPlus : vs}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    table({children}) {
                        return (
                            <div className="table-responsive">
                                <table className="markdown-table">{children}</table>
                            </div>
                        );
                    },
                    img({src, alt}) {
                        return (
                            <div className="markdown-image">
                                <img src={src} alt={alt} loading="lazy" />
                                {alt && <span className="image-caption">{alt}</span>}
                            </div>
                        );
                    }
                }}
            >
                {markdown}
            </ReactMarkdown>
        );
    };

    const renderDiagram = (diagram) => {
        if (!diagram) return null;

        switch(diagram.type) {
            case 'flowchart':
                return (
                    <div className="diagram-container flowchart">
                        <h5>{diagram.title}</h5>
                        <div className="flowchart-wrapper">
                            {diagram.steps && diagram.steps.map((step, idx) => (
                                <div key={idx} className="flowchart-step">
                                    <div className={`step-box ${step.type || ''}`}>
                                        {step.content}
                                    </div>
                                    {idx < diagram.steps.length - 1 && (
                                        <div className="step-arrow">↓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'mindmap':
                return (
                    <div className="diagram-container mindmap">
                        <h5>{diagram.title}</h5>
                        <div className="mindmap-wrapper">
                            <div className="mindmap-central">{diagram.central}</div>
                            <div className="mindmap-branches">
                                {diagram.branches && diagram.branches.map((branch, idx) => (
                                    <div key={idx} className="mindmap-branch">
                                        <div className="branch-label">{branch.label}</div>
                                        <div className="branch-nodes">
                                            {branch.nodes && branch.nodes.map((node, nodeIdx) => (
                                                <div key={nodeIdx} className="mindmap-node">{node}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderTable = (table) => {
        if (!table) return null;

        return (
            <div className="advanced-table-container">
                {table.title && <h5>{table.title}</h5>}
                <div className="table-responsive">
                    <table className="advanced-data-table">
                        {table.headers && (
                            <thead>
                                <tr>
                                    {table.headers.map((header, idx) => (
                                        <th key={idx}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {table.rows && table.rows.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    {row.map((cell, cellIdx) => (
                                        <td key={cellIdx}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {table.caption && <div className="table-caption">{table.caption}</div>}
            </div>
        );
    };

    const renderContent = () => {
        if (!content) return null;

        if (typeof content === 'string') {
            return renderMarkdown(content);
        }

        if (Array.isArray(content)) {
            return content.map((item, index) => {
                if (!item) return null;

                if (typeof item === 'string') {
                    return <div key={index} className="content-item">{renderMarkdown(item)}</div>;
                }

                switch(item.type) {
                    case 'code':
                        return renderCodeBlock(item.code, item.language, index, item.title);

                    case 'diagram':
                        return renderDiagram(item);

                    case 'table':
                        return renderTable(item);

                    case 'image':
                        return (
                            <div key={index} className="content-item image-item">
                                <img src={item.url} alt={item.alt} className="content-image" />
                                {item.caption && <p className="image-caption">{item.caption}</p>}
                            </div>
                        );

                    case 'list':
                        return (
                            <div key={index} className="content-item list-item">
                                {item.ordered ? (
                                    <ol className="advanced-list ordered">
                                        {item.items && item.items.map((listItem, listIdx) => (
                                            <li key={listIdx}>{listItem}</li>
                                        ))}
                                    </ol>
                                ) : (
                                    <ul className="advanced-list unordered">
                                        {item.items && item.items.map((listItem, listIdx) => (
                                            <li key={listIdx}>{listItem}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );

                    case 'section':
                        return (
                            <div key={index} className="content-section">
                                <div
                                    className="section-header"
                                    onClick={() => toggleSection(item.id)}
                                >
                                    <h4>{item.title}</h4>
                                    {expandedSections[item.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {expandedSections[item.id] !== false && (
                                    <div className="section-content">
                                        {renderMarkdown(item.content)}
                                    </div>
                                )}
                            </div>
                        );

                    default:
                        return null;
                }
            });
        }

        return null;
    };

    return (
        <div className={`advanced-answer ${getFontSizeClass()}`}>
            {/* Answer Toolbar - Only show if there are sections */}
            {(content || safeCodeBlocks.length > 0 || safeDiagrams.length > 0 || safeTables.length > 0) && (
                <div className="answer-toolbar">
                    <div className="toolbar-left">
                        {content && (
                            <button
                                className={`toolbar-btn ${activeTab === 'content' ? 'active' : ''}`}
                                onClick={() => setActiveTab('content')}
                            >
                                <FileText size={16} />
                                <span>Content</span>
                            </button>
                        )}
                        {safeCodeBlocks.length > 0 && (
                            <button
                                className={`toolbar-btn ${activeTab === 'code' ? 'active' : ''}`}
                                onClick={() => setActiveTab('code')}
                            >
                                <Code size={16} />
                                <span>Code ({safeCodeBlocks.length})</span>
                            </button>
                        )}
                        {safeDiagrams.length > 0 && (
                            <button
                                className={`toolbar-btn ${activeTab === 'diagrams' ? 'active' : ''}`}
                                onClick={() => setActiveTab('diagrams')}
                            >
                                <Image size={16} />
                                <span>Diagrams ({safeDiagrams.length})</span>
                            </button>
                        )}
                        {safeTables.length > 0 && (
                            <button
                                className={`toolbar-btn ${activeTab === 'tables' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tables')}
                            >
                                <TableIcon size={16} />
                                <span>Tables ({safeTables.length})</span>
                            </button>
                        )}
                    </div>
                    <div className="toolbar-right">
                        <select
                            className="font-size-select"
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Answer Content */}
            <div className="answer-content-wrapper">
                {activeTab === 'content' && renderContent()}

                {activeTab === 'code' && safeCodeBlocks.length > 0 && (
                    <div className="code-blocks-tab">
                        {safeCodeBlocks.map((block, index) =>
                            renderCodeBlock(block.code, block.language, index, block.title)
                        )}
                    </div>
                )}

                {activeTab === 'diagrams' && safeDiagrams.length > 0 && (
                    <div className="diagrams-tab">
                        {safeDiagrams.map((diagram, index) => (
                            <div key={index} className="diagram-wrapper">
                                {renderDiagram(diagram)}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'tables' && safeTables.length > 0 && (
                    <div className="tables-tab">
                        {safeTables.map((table, index) => (
                            <div key={index} className="table-wrapper">
                                {renderTable(table)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Component
const InterviewQuestions = () => {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [copiedId, setCopiedId] = useState(null);

    // Refs
    const searchInputRef = useRef(null);
    const accordionRef = useRef(null);

    // Custom Hooks
    const { data: questions, loading, error } = useInterviewData('interview_questions.json');
    const {
        bookmarkedIds,
        answeredIds,
        recentlyViewed,
        progress,
        toggleBookmark,
        toggleAnswered,
        trackView,
        setRecentlyViewed
    } = useInterviewTracking(questions);

    // Constants
    const questionsPerPage = 10;

    // Filter questions
    const filteredQuestions = useMemo(() =>
        filterQuestions(questions, searchTerm, selectedCategory, selectedDifficulty),
        [questions, searchTerm, selectedCategory, selectedDifficulty]
    );

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

    // Get unique categories and difficulties
    const categories = useMemo(() => {
        if (!questions) return ['All'];
        return ['All', ...new Set(questions.map(q => q.category))].sort();
    }, [questions]);

    const difficulties = useMemo(() => {
        if (!questions) return ['All'];
        return ['All', ...new Set(questions.map(q => q.difficulty))].sort();
    }, [questions]);

    // Stats
    const stats = useMemo(() => ({
        total: questions?.length || 0,
        bookmarked: bookmarkedIds.length,
        answered: answeredIds.length,
        filtered: filteredQuestions.length
    }), [questions, bookmarkedIds, answeredIds, filteredQuestions]);

    // Effects
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        return () => document.body.classList.remove('dark-mode');
    }, [darkMode]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchTerm) {
                setSearchTerm('');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [searchTerm]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
        setActiveIndex(null);
    }, [searchTerm, selectedCategory, selectedDifficulty]);

    // Handlers
    const showNotification = useCallback((message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, []);

    const handleToggleBookmark = useCallback((id, question) => {
        toggleBookmark(id);
        showNotification(bookmarkedIds.includes(id) ? 'Bookmark removed' : 'Bookmark added');
    }, [bookmarkedIds, toggleBookmark, showNotification]);

    const handleToggleAnswered = useCallback((id, question) => {
        toggleAnswered(id);
        showNotification(answeredIds.includes(id) ? 'Marked as unanswered' : 'Marked as answered');
    }, [answeredIds, toggleAnswered, showNotification]);

    const handleToggleAnswer = useCallback((index) => {
        setActiveIndex(prev => prev === index ? null : index);
        if (filteredQuestions[index]) {
            trackView(filteredQuestions[index]);
        }
    }, [filteredQuestions, trackView]);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedDifficulty('All');
        searchInputRef.current?.focus();
    }, []);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        accordionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveIndex(null);
    }, []);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    const copyQuestionLink = useCallback((id) => {
        const url = `${window.location.origin}${window.location.pathname}?question=${id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        showNotification('Link copied to clipboard!');
    }, [showNotification]);

    const renderStars = useCallback(() => {
        return [1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`star-icon ${star <= (hoverRating || rating) ? 'active' : ''}`}
                size={20}
                onClick={() => {
                    setRating(star);
                    showNotification(`Thanks for your ${star} star rating!`);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
            />
        ));
    }, [rating, hoverRating, showNotification]);

    // Pagination
    const paginatedQuestions = useMemo(() => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        return filteredQuestions.slice(startIndex, startIndex + questionsPerPage);
    }, [filteredQuestions, currentPage, questionsPerPage]);

    // Render pagination
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center flex-wrap">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            Previous
                        </button>
                    </li>

                    {startPage > 1 && (
                        <>
                            <li className="page-item">
                                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                            </li>
                            {startPage > 2 && (
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )}
                        </>
                    )}

                    {pageNumbers.map(num => (
                        <li className={`page-item ${num === currentPage ? 'active' : ''}`} key={num}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(num)}
                                aria-label={`Page ${num}`}
                                aria-current={num === currentPage ? 'page' : undefined}
                            >
                                {num}
                            </button>
                        </li>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )}
                            <li className="page-item">
                                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                                    {totalPages}
                                </button>
                            </li>
                        </>
                    )}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    // Floating Actions
    const renderFloatingActions = () => (
        <div className="floating-actions">
            <button
                className="fab dark-mode-toggle"
                onClick={toggleDarkMode}
                data-tooltip={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {activeIndex !== null && (
                <button
                    className="fab scroll-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    data-tooltip="Back to top"
                >
                    <ArrowUp size={18} />
                </button>
            )}
        </div>
    );

    // Loading State
    if (loading) {
        return (
            <div className="interview-questions-page py-5">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading interview questions...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="interview-questions-page py-5">
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>Error Loading Questions</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </div>
        );
    }

    return (
        <div className={`interview-questions-page ${darkMode ? 'dark-mode' : ''}`}>
            {!isOnline && (
                <Alert variant="warning" className="fixed-top">
                    You are currently offline. Some content may not be up-to-date.
                </Alert>
            )}

            {renderFloatingActions()}

            <div className="container py-5">
                {/* Header */}
                <div className="interview-questions-content mb-5">
                    <h1 className="mb-3 display-5 fw-bold text-center">
                        Interview Questions & Answers
                    </h1>
                    <p className="lead text-center text-muted">
                        Master your next interview with our curated collection of QA interview questions
                    </p>

                    {/* Progress Bar */}
                    {progress > 0 && (
                        <div className="progress-container mb-4">
                            <div className="progress">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${progress}%` }}
                                    aria-valuenow={progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    {progress}% Complete
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Bar */}
                    <div className="stats-bar mb-4 d-flex justify-content-center flex-wrap">
                        <div className="stat-item mx-3">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Questions</span>
                        </div>
                        <div className="stat-item mx-3">
                            <span className="stat-value">{stats.bookmarked}</span>
                            <span className="stat-label">Bookmarked</span>
                        </div>
                        <div className="stat-item mx-3">
                            <span className="stat-value">{stats.answered}</span>
                            <span className="stat-label">Answered</span>
                        </div>
                        <div className="stat-item mx-3">
                            <span className="stat-value">{stats.filtered}</span>
                            <span className="stat-label">Showing</span>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="search-filters-container mb-4">
                        <div className="search-bar-container position-relative mb-3">
                            <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
                                <Search className="search-icon" size={20} />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="form-control search-bar"
                                    placeholder="Search questions... (Ctrl+F)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    aria-label="Search questions"
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-link search-clear"
                                        onClick={() => setSearchTerm('')}
                                        aria-label="Clear search"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            <button
                                className="btn btn-primary print-btn"
                                onClick={handlePrint}
                                aria-label="Print questions"
                            >
                                <Printer size={18} className="me-1" />
                                Print
                            </button>
                        </div>

                        <div className="filters-container d-flex flex-wrap justify-content-center gap-3">
                            <div className="filter-group">
                                <label htmlFor="categoryFilter" className="filter-label">Category:</label>
                                <select
                                    id="categoryFilter"
                                    className="form-select filter-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category} {category !== 'All' && `(${questions?.filter(q => q.category === category).length})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="difficultyFilter" className="filter-label">Difficulty:</label>
                                <select
                                    id="difficultyFilter"
                                    className="form-select filter-select"
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                >
                                    {difficulties.map(difficulty => (
                                        <option key={difficulty} value={difficulty}>
                                            {difficulty} {difficulty !== 'All' && `(${questions?.filter(q => q.difficulty === difficulty).length})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
                                <button
                                    className="btn btn-link text-danger text-decoration-none"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Results Summary */}
                        {filteredQuestions.length > 0 && (
                            <div className="text-center mt-3 text-muted small">
                                Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
                                {filteredQuestions.length !== stats.total &&
                                    ` (filtered from ${stats.total} total)`}
                            </div>
                        )}
                    </div>

                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                        <div className="recently-viewed mb-4">
                            <h6 className="text-muted mb-2">Recently Viewed:</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {recentlyViewed.map((item, i) => (
                                    <button
                                        key={i}
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                            const question = questions?.find(q => q.id === item.id);
                                            if (question) {
                                                const index = filteredQuestions.findIndex(q => q.id === item.id);
                                                if (index !== -1) {
                                                    setActiveIndex(index);
                                                    accordionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }
                                        }}
                                    >
                                        {item.question.length > 30
                                            ? item.question.substring(0, 30) + '...'
                                            : item.question}
                                        <button
                                            className="btn-close ms-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRecentlyViewed(prev => prev.filter(view => view.id !== item.id));
                                            }}
                                            aria-label="Remove"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Questions Accordion */}
                <div id="accordion" ref={accordionRef} aria-live="polite">
                    {paginatedQuestions.length > 0 ? (
                        paginatedQuestions.map((item, index) => {
                            const globalIndex = (currentPage - 1) * questionsPerPage + index;
                            const isBookmarked = bookmarkedIds.includes(item.id);
                            const isAnswered = answeredIds.includes(item.id);
                            const isActive = activeIndex === globalIndex;

                            return (
                                <div className="card question-card mb-3" key={item.id}>
                                    <div className="card-header" id={`heading${item.id}`}>
                                        <div className="d-flex align-items-start w-100">
                                            <h2 className="mb-0 flex-grow-1">
                                                <button
                                                    className="btn btn-link w-100 text-start d-flex align-items-center text-decoration-none"
                                                    type="button"
                                                    aria-expanded={isActive}
                                                    aria-controls={`collapse${item.id}`}
                                                    onClick={() => handleToggleAnswer(globalIndex)}
                                                >
                                                    <span className="me-2">
                                                        {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </span>
                                                    <span className="question-text">
                                                        {item.question}
                                                        {isAnswered && (
                                                            <span className="answered-badge ms-2">
                                                                <CheckCircle size={16} className="me-1" />
                                                                Answered
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className={`difficulty-badge badge ms-2 bg-${
                                                        item.difficulty === 'Beginner' ? 'success' :
                                                        item.difficulty === 'Intermediate' ? 'warning' : 'danger'
                                                    }`}>
                                                        {item.difficulty}
                                                    </span>
                                                </button>
                                            </h2>

                                            <div className="action-buttons ms-2 d-flex gap-2">
                                                <button
                                                    className={`btn btn-sm bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleBookmark(item.id, item);
                                                    }}
                                                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                                                >
                                                    {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                                </button>

                                                <button
                                                    className={`btn btn-sm answered-btn ${isAnswered ? 'answered' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleAnswered(item.id, item);
                                                    }}
                                                    aria-label={isAnswered ? "Mark as unanswered" : "Mark as answered"}
                                                >
                                                    {isAnswered ? <CheckCircle size={18} /> : <Circle size={18} />}
                                                </button>

                                                <button
                                                    className="btn btn-sm copy-link-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyQuestionLink(item.id);
                                                    }}
                                                    aria-label="Copy link to question"
                                                >
                                                    {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        id={`collapse${item.id}`}
                                        className={`collapse ${isActive ? 'show' : ''}`}
                                        aria-labelledby={`heading${item.id}`}
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            <div className="question-meta mb-3">
                                                <span className="category-badge badge me-2">
                                                    {item.category}
                                                </span>
                                                {item.tags && item.tags.map(tag => (
                                                    <span key={tag} className="tag-badge badge me-1">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Advanced Answer Component */}
                                            <AdvancedAnswer
                                                content={item.answer?.content}
                                                codeBlocks={item.answer?.codeBlocks}
                                                diagrams={item.answer?.diagrams}
                                                tables={item.answer?.tables}
                                                darkMode={darkMode}
                                            />

                                            {/* Additional Resources */}
                                            {item.resources && (
                                                <div className="additional-resources mt-4">
                                                    <h6>Additional Resources:</h6>
                                                    <ul className="resource-list">
                                                        {item.resources.map((resource, idx) => (
                                                            <li key={idx}>
                                                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink size={14} />
                                                                    {resource.title}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results text-center py-5">
                            <h3 className="h4 mb-3">No questions found</h3>
                            <p className="text-muted mb-3">Try adjusting your search or filters</p>
                            <button
                                className="btn btn-primary"
                                onClick={clearFilters}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {renderPagination()}

                {/* Rating Section */}
                <div className="rating-section text-center mt-5">
                    <h5>Rate this Interview Guide</h5>
                    <div className="stars-container mb-2">
                        {renderStars()}
                    </div>
                    <small className="text-muted">
                        {rating > 0 ? `You rated ${rating} stars` : 'Click to rate'}
                    </small>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="text-center mt-4 small text-muted">
                    <span className="me-3">💡 <kbd>Ctrl</kbd> + <kbd>F</kbd> to search</span>
                    <span>⎋ <kbd>Esc</kbd> to clear search</span>
                </div>
            </div>

            {/* Toast Notifications */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                className="position-fixed bottom-0 end-0 m-3"
                delay={3000}
                autohide
            >
                <Toast.Header className="bg-primary text-white">
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default InterviewQuestions;