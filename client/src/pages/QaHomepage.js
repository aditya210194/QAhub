import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./QaHomepage.module.css"; // Import CSS Module

const QaHomepage = () => {
    const [questions, setQuestions] = useState([]);
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/qa/questions`, {
                params: { sort, page },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data?.questions) {
                throw new Error("Invalid API response structure");
            }

            setQuestions(response.data.questions);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setError(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    }, [sort, page]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAskQuestion = () => navigate("/ask");

    const renderQuestionSkeleton = () => (
        Array(5).fill(0).map((_, index) => (
            <motion.div
                key={`skeleton-${index}`}
                className={styles.questionSkeleton}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
            >
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonDescription}></div>
                <div className={styles.skeletonMeta}></div>
            </motion.div>
        ))
    );

    const renderQuestion = (q) => (
        <motion.div
            key={q._id}
            className={styles.questionCard}
            onClick={() => navigate(`/community-features/qa/questions/${q._id}`)}
            initial={{y: 20, opacity: 1}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.3}}
        >
            <h3 className={styles.questionTitle}>{q.title || "Untitled Question"}</h3>
            <p
                className={styles.questionDescription}
                dangerouslySetInnerHTML={{__html: q.description}}
            ></p>

            <div className={styles.questionMeta}>
                <span className={styles.metaItem}>👤 {q.user?.username || 'Anonymous'}</span>
                <span className={styles.metaItem}>📅 {new Date(q.createdAt).toLocaleDateString()}</span>
                <span className={styles.metaItem}>🗨️ {q.answersCount} answers</span>
            </div>
            <div className={styles.tags}>
                {q.tags?.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className={styles.qaHomepage}>
            <div className={styles.header}>
                <h1>Community Questions</h1>
                <button
                    onClick={handleAskQuestion}
                    className={styles.askButton}
                    disabled={loading}
                >
                    Ask Question
                </button>
            </div>

            <div className={styles.controls}>
                <select
                    onChange={(e) => setSort(e.target.value)}
                    value={sort}
                    disabled={loading}
                >
                    <option value="newest">Newest</option>
                    <option value="mostAnswered">Most Answered</option>
                    <option value="unanswered">Unanswered</option>
                    <option value="trending">Trending</option>
                </select>
                <span className={styles.paginationInfo}>
                    Showing page {page} of {totalPages}
                </span>
            </div>
             {/* NEW INFO BOX */}
                    <div className={styles.infoBox}>
                        <div className={styles.infoBoxIcon}>💡</div>
                        <div className={styles.infoBoxContent}>
                            <h3 className={styles.infoBoxTitle}>QA Community Q&A</h3>
                            <p className={styles.infoBoxText}>
                                Have a testing question? Stuck with a bug? This is the place to ask and answer.
                                Our community of QA professionals is here to help you grow.
                            </p>
                            <ul className={styles.infoBoxList}>
                                <li><span>❓</span> Ask any testing-related question</li>
                                <li><span>💬</span> Get answers from experienced testers</li>
                                <li><span>🏆</span> Earn reputation points for helpful answers</li>
                                <li><span>🔍</span> Search previous answers for quick solutions</li>
                            </ul>
                        </div>
                    </div>

            {error && (
                <div className={styles.errorAlert}>
                    ❌ Error loading questions: {error}
                    <button
                        className={styles.retryButton}
                        onClick={fetchQuestions}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className={styles.questionsList}>
                {loading ? renderQuestionSkeleton() : (
                    questions.length > 0 ? (
                        questions.map(renderQuestion)
                    ) : (
                        <div className={styles.noQuestions}>
                            No questions found. Be the first to ask one!
                        </div>
                    )
                )}
            </div>

            <div className={styles.pagination}>
                <button
                    className={styles.paginationButton}
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`${styles.paginationButton} ${page === i + 1 ? styles.active : ""}`}
                        onClick={() => setPage(i + 1)}
                        disabled={loading}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className={styles.paginationButton}
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages || loading}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default QaHomepage;