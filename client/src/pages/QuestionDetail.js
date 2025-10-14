import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./QuestionDetails.module.css"; // Import CSS Module

const QuestionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});
    const [sortAnswers, setSortAnswers] = useState("votes");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [userVotes, setUserVotes] = useState({});
    const [answerText, setAnswerText] = useState("");
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/zip', 'application/x-zip-compressed'];

    const fetchQuestionDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/qa/questions/${id}`,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            );

            const questionData = response.data || {};
            const answers = questionData.answers || [];

            const votes = {};
            answers.forEach(answer => {
                votes[answer._id] = answer.userVote || null;
            });

            setQuestion(questionData);
            setUserVotes(votes);
        } catch (error) {
            console.error("Error fetching question details:", error);
            setError(error.response?.data?.error || error.message);

            if (error.response?.status === 429) {
                const retryAfter = error.response.headers["retry-after"] || 5;
                setTimeout(() => setRetryCount(prev => prev + 1), retryAfter * 1000);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchQuestionDetails();
    }, [fetchQuestionDetails, retryCount]);

    const handleVote = async (answerId, voteType) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return navigate("/login");

            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/qa/answers/${answerId}/vote`,
                { voteType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUserVotes(prev => ({
                ...prev,
                [answerId]: voteType === "up" ?
                    (prev[answerId] === "up" ? null : "up") :
                    (prev[answerId] === "down" ? null : "down")
            }));
            fetchQuestionDetails();
        } catch (error) {
            console.error("Voting failed:", error);
            setError(error.response?.data?.error || "Voting failed");
        }
    };

    const handleComment = async (answerId) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return navigate("/login");

            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/qa/answers/${answerId}/comment`,
                { text: commentTexts[answerId] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCommentTexts(prev => ({ ...prev, [answerId]: "" }));
            fetchQuestionDetails();
        } catch (error) {
            console.error("Comment failed:", error);
            setError(error.response?.data?.error || "Comment failed");
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const token = sessionStorage.getItem("token");
            if (!token) return navigate("/login");

            // File validation
            for (const file of files) {
                if (file.size > MAX_FILE_SIZE) {
                    setError(`File too large: ${file.name} (max 5MB)`);
                    return;
                }
                if (!ALLOWED_TYPES.includes(file.type)) {
                    setError(`Invalid file type: ${file.name} (allowed: JPEG, PNG, ZIP)`);
                    return;
                }
            }

            const formData = new FormData();
            formData.append("answerText", answerText.trim());
            files.forEach(file => formData.append("files", file));

            setUploading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/qa/questions/${id}/answers`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                setAnswerText("");
                setFiles([]);
                fetchQuestionDetails();
            }
        } catch (error) {
            console.error("Answer submission failed:", error);
            if (error.response) {
                setError(error.response.data?.error || "Answer submission failed. Please try again.");
            } else if (error.request) {
                setError("No response from the server. Please check your connection.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setUploading(false);
        }
    };

    const sortedAnswers = question?.answers?.sort((a, b) => {
        if (sortAnswers === "votes") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        if (sortAnswers === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
    }) || [];

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingPulse}>
                    <div className={styles.loadingLine}></div>
                    <div className={styles.loadingLine}></div>
                    <div className={styles.loadingLine}></div>
                </div>
            </div>
        );
    }

    if (error && !question) {
        return (
            <div className={styles.container}>
                <div className={styles.errorAlert}>
                    ❌ Error: {error}
                    <button className={styles.retryButton} onClick={() => setRetryCount(prev => prev + 1)}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className={styles.container}>
                <div className={styles.warningAlert}>Question not found.</div>
            </div>
        );
    }

    return (
        <motion.div className={styles.container} initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                ← Back to Questions
            </button>

            <h2 className={styles.questionTitle}>{question.title}</h2>

            <div className={styles.questionMeta}>
                <span>Asked: {new Date(question.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Answers: {question.answers?.length || 0}</span>
                <span>•</span>
                <span>Views: {question.views || 0}</span>
            </div>

            <div className={styles.tags}>
                {question.tags?.map((tag) => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
            </div>

            <div className={styles.questionDescription} dangerouslySetInnerHTML={{ __html: question.description }} />

            <form onSubmit={handleAnswerSubmit} className={styles.answerForm}>
                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                        <button type="button" className={styles.closeButton} onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <label htmlFor="answerText" className={styles.formLabel}>Your Answer</label>
                <textarea
                    id="answerText"
                    className={styles.formInput}
                    rows="5"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                />

                <label htmlFor="fileUpload" className={styles.formLabel}>
                    Upload Files (JPEG, PNG, ZIP - max 5MB each)
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    className={styles.formInput}
                    multiple
                    onChange={(e) => setFiles([...e.target.files])}
                    accept=".jpg,.jpeg,.png,.zip"
                />
                {files.length > 0 && (
                    <div className={styles.fileList}>
                        Selected files: {files.map(f => f.name).join(", ")}
                    </div>
                )}

                <button type="submit" className={styles.submitButton} disabled={uploading || !answerText.trim()}>
                    {uploading ? "Uploading..." : "Submit Answer"}
                </button>
            </form>

            <div className={styles.answersHeader}>
                <h3>Answers ({sortedAnswers.length})</h3>
                <select
                    value={sortAnswers}
                    onChange={(e) => setSortAnswers(e.target.value)}
                    className={styles.sortSelect}
                >
                    <option value="votes">Most Votes</option>
                    <option value="newest">Newest First</option>
                </select>
            </div>

            <div className={styles.answersList}>
                {sortedAnswers.length > 0 ? (
                    sortedAnswers.map((ans) => (
                        <motion.div key={ans._id} className={styles.answerCard} initial={{ y: 20 }} animate={{ y: 0 }}>
                            <div className={styles.answerContent} dangerouslySetInnerHTML={{ __html: ans.answerText }} />

                            {ans.files?.length > 0 && (
                                <div className={styles.attachments}>
                                    <h5>Attachments:</h5>
                                    <div className={styles.fileLinks}>
                                        {ans.files.map((file, index) => (
                                            <a
                                                key={index}
                                                href={`${process.env.REACT_APP_API_URL}/uploads/${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.fileLink}
                                            >
                                                {file}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.voteButtons}>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className={`${styles.voteButton} ${userVotes[ans._id] === "up" ? styles.upvoted : ""}`}
                                    onClick={() => handleVote(ans._id, "up")}
                                >
                                    👍 {ans.upvotes || 0}
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className={`${styles.voteButton} ${userVotes[ans._id] === "down" ? styles.downvoted : ""}`}
                                    onClick={() => handleVote(ans._id, "down")}
                                >
                                    👎 {ans.downvotes || 0}
                                </motion.button>
                                <span className={styles.answerMeta}>
                                    Answered by {ans.user?.username || "Anonymous"} •
                                    {new Date(ans.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className={styles.commentSection}>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className={styles.commentInput}
                                    value={commentTexts[ans._id] || ""}
                                    onChange={(e) => setCommentTexts({ ...commentTexts, [ans._id]: e.target.value })}
                                />
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className={styles.commentButton}
                                    onClick={() => handleComment(ans._id)}
                                >
                                    Post Comment
                                </motion.button>
                            </div>

                            {ans.comments?.length > 0 && (
                                <div className={styles.commentsList}>
                                    {ans.comments.map((c, index) => (
                                        <div key={index} className={styles.comment}>
                                            💬 <strong>{c.user?.username || "Anonymous"}</strong>: {c.text}
                                            <span className={styles.commentDate}>
                                                ({new Date(c.createdAt).toLocaleString()})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className={styles.noAnswers}>No answers yet. Be the first to answer!</div>
                )}
            </div>
        </motion.div>
    );
};

export default QuestionDetails;