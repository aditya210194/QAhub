import React, { useEffect, useMemo, useState } from 'react';
import './InterviewQA.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bookmark, BookmarkCheck, Printer, Search, CheckCircle, Circle } from 'lucide-react';

const InterviewQuestions = () => {
    const questions = useMemo(() => [
        {
            id: 1,
            question: "Explain the steps for Bug Cycle?",
            answer: [
                "Once the bug is identified by the tester, it is assigned to the development manager in OPEN status.",
                "If the bug is a valid defect, the development team will FIX it.",
                "If it is not a valid defect, the defect will be IGNORED and marked as REJECTED.",
                "Check whether the bug is in scope. If not part of the current release, it is POSTPONED.",
                "If the defect or bug was raised earlier, the tester assigns a DUPLICATE status.",
                "When assigned to a developer to fix, it gets IN-PROGRESS status.",
                "Once repaired, the status changes to FIXED.",
                "If it passes the final test, the tester marks it as CLOSED.",
            ],
            category: "Bug Tracking",
            difficulty: "Intermediate"
        },
        {
            id: 2,
            question: "What is Software Testing?",
            answer: "Software Testing is the process of evaluating and verifying that a software product or application meets the specified requirements. It involves identifying bugs, gaps, or missing requirements in the implemented functionality.",
            category: "Fundamentals",
            difficulty: "Beginner"
        },
        // Add more questions with categories and difficulties
        // ... other questions
    ], []);

    const [activeIndex, setActiveIndex] = useState(null);
    const [filteredQuestions, setFilteredQuestions] = useState(questions);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [answeredIds, setAnsweredIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    const questionsPerPage = 10;
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

    // Get unique categories
    const categories = useMemo(() =>
            ['All', ...new Set(questions.map(q => q.category))],
        [questions]
    );

    // Get unique difficulties
    const difficulties = useMemo(() =>
            ['All', ...new Set(questions.map(q => q.difficulty))],
        [questions]
    );

    // Filter questions based on search, category, and difficulty
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            let filtered = questions;

            if (searchTerm) {
                filtered = filtered.filter(q =>
                    q.question.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (selectedCategory !== 'All') {
                filtered = filtered.filter(q => q.category === selectedCategory);
            }

            if (selectedDifficulty !== 'All') {
                filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
            }

            setFilteredQuestions(filtered);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCategory, selectedDifficulty, questions]);

    // Load bookmarks and answered status from localStorage
    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
        const savedAnswered = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');

        if (savedBookmarks) setBookmarkedIds(savedBookmarks);
        if (savedAnswered) setAnsweredIds(savedAnswered);
    }, []);

    // Save bookmarks and answered status to localStorage
    useEffect(() => {
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedIds));
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredIds));
    }, [bookmarkedIds, answeredIds]);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const toggleBookmark = (id) => {
        setBookmarkedIds(prev =>
            prev.includes(id)
                ? prev.filter(bookmarkId => bookmarkId !== id)
                : [...prev, id]
        );
    };

    const toggleAnswered = (id) => {
        setAnsweredIds(prev =>
            prev.includes(id)
                ? prev.filter(ansId => ansId !== id)
                : [...prev, id]
        );
    };

    const paginate = (questions, currentPage, questionsPerPage) => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        return questions.slice(startIndex, startIndex + questionsPerPage);
    };

    const currentQuestions = paginate(filteredQuestions, currentPage, questionsPerPage);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container interview-questions-page py-5">
            {/* Header */}
            <div className="interview-questions-content mb-5">
                <h1 className="mb-3 display-5 fw-bold text-center">
                    Interview Questions & Answers
                </h1>
                <p className="lead text-center">
                    Search and explore curated interview questions to help you ace your next job interview
                </p>

                {/* Stats Bar */}
                <div className="stats-bar mb-4 d-flex justify-content-center flex-wrap">
                    <div className="stat-item mx-3">
                        <span className="stat-value">{questions.length}</span>
                        <span className="stat-label">Total Questions</span>
                    </div>
                    <div className="stat-item mx-3">
                        <span className="stat-value">{bookmarkedIds.length}</span>
                        <span className="stat-label">Bookmarked</span>
                    </div>
                    <div className="stat-item mx-3">
                        <span className="stat-value">{answeredIds.length}</span>
                        <span className="stat-label">Answered</span>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="search-filters-container mb-4">
                    <div className="search-bar-container position-relative mb-3">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="form-control search-bar ps-5"
                            placeholder="Search for a question..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search questions"
                        />
                        <button
                            className="btn btn-primary print-btn"
                            onClick={handlePrint}
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
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
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
                                {difficulties.map((difficulty, index) => (
                                    <option key={index} value={difficulty}>
                                        {difficulty}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Accordion */}
            <div id="accordion" aria-live="polite">
                {currentQuestions.length > 0 ? (
                    currentQuestions.map((item, index) => {
                        const isBookmarked = bookmarkedIds.includes(item.id);
                        const isAnswered = answeredIds.includes(item.id);

                        return (
                            <div className="card question-card mb-3" key={item.id}>
                                <div className="card-header d-flex justify-content-between align-items-center" id={`heading${index}`}>
                                    <h2 className="mb-0 flex-grow-1">
                                        <button
                                            className="btn btn-link w-100 text-left d-flex justify-content-between align-items-center"
                                            type="button"
                                            aria-expanded={activeIndex === index ? 'true' : 'false'}
                                            aria-controls={`collapse${index}`}
                                            onClick={() => toggleAnswer(index)}
                                        >
                                            <span className="question-text">
                                                {item.question}
                                                {isAnswered && (
                                                    <span className="answered-badge ms-2">
                                                        <CheckCircle size={16} className="me-1" />
                                                        Answered
                                                    </span>
                                                )}
                                            </span>
                                            <span className="difficulty-badge badge">
                                                {item.difficulty}
                                            </span>
                                        </button>
                                    </h2>

                                    <div className="action-buttons ms-2">
                                        <button
                                            className={`btn btn-sm bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleBookmark(item.id);
                                            }}
                                            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                                        >
                                            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                        </button>

                                        <button
                                            className={`btn btn-sm answered-btn ${isAnswered ? 'answered' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAnswered(item.id);
                                            }}
                                            aria-label={isAnswered ? "Mark as unanswered" : "Mark as answered"}
                                        >
                                            {isAnswered ? <CheckCircle size={18} /> : <Circle size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div
                                    id={`collapse${index}`}
                                    className={`collapse ${activeIndex === index ? 'show' : ''}`}
                                    aria-labelledby={`heading${index}`}
                                    data-parent="#accordion"
                                >
                                    <div className="card-body">
                                        <div className="question-meta mb-3">
                                            <span className="category-badge badge me-2">
                                                {item.category}
                                            </span>
                                        </div>

                                        {Array.isArray(item.answer) ? (
                                            <ul className="answer-list">
                                                {item.answer.map((step, idx) => (
                                                    <li key={idx}>{step}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="answer-text">{item.answer}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-results text-center py-5">
                        <h3>No questions found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>

                        {[...Array(totalPages).keys()].map(num => (
                            <li
                                className={`page-item ${num + 1 === currentPage ? 'active' : ''}`}
                                key={num}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(num + 1)}
                                >
                                    {num + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default InterviewQuestions;