import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import "./QuestionDetails.css";

const QuestionDetails = () => {
    const { id } = useParams();
    const router = useRouter();
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

    // Rich text editor setup - EXACTLY like AskQuestion
    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            BulletList,
            OrderedList,
            Blockquote,
            Underline,
            Heading.configure({ levels: [1, 2, 3] }),
            Highlight,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            CodeBlock,
            Image,
            Placeholder.configure({
                placeholder: "Write your answer in detail... Use the toolbar above to format your text."
            }),
        ],
        content: answerText,
        onUpdate: ({ editor }) => {
            setAnswerText(editor.getHTML());
        },
    });

    const fetchQuestionDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/qa/questions/${id}`,
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
            if (!token) return router.push("/login");

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/qa/answers/${answerId}/vote`,
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
            if (!token) return router.push("/login");

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/qa/answers/${answerId}/comment`,
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
            if (!token) return router.push("/login");

            const description = editor?.getHTML() || "";

            if (!description.trim()) {
                setError("Answer is required.");
                setUploading(false);
                return;
            }

            if (description.length < 10) {
                setError("Answer must be at least 10 characters long.");
                setUploading(false);
                return;
            }

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
            formData.append("answerText", description);
            files.forEach(file => formData.append("files", file));

            setUploading(true);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/qa/questions/${id}/answers`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                setAnswerText("");
                setFiles([]);
                editor?.commands.setContent("");
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

    const isActive = (type, options = {}) => {
        return editor?.isActive(type, options) ? styles.isActive : '';
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
            <button onClick={() => router.back()} className={styles.backButton}>
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

            {/* Answer Form with Rich Text Editor - EXACTLY like AskQuestion */}
            <form onSubmit={handleAnswerSubmit} className={styles.answerForm}>
                <h3 className={styles.formTitle}>Your Answer</h3>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.editorWrapper}>
                    <div className={styles.toolbar}>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={isActive('bold')}
                            title="Bold"
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={isActive('italic')}
                            title="Italic"
                        >
                            <em>I</em>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            className={isActive('underline')}
                            title="Underline"
                        >
                            <u>U</u>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={isActive('heading', { level: 1 })}
                            title="Heading 1"
                        >
                            H1
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={isActive('heading', { level: 2 })}
                            title="Heading 2"
                        >
                            H2
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={isActive('heading', { level: 3 })}
                            title="Heading 3"
                        >
                            H3
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            className={isActive('bulletList')}
                            title="Bullet List"
                        >
                            • List
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            className={isActive('orderedList')}
                            title="Numbered List"
                        >
                            1. List
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            className={isActive('blockquote')}
                            title="Quote"
                        >
                            &ldquo; Quote
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleHighlight().run()}
                            className={isActive('highlight')}
                            title="Highlight"
                        >
                            Highlight
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            className={isActive('codeBlock')}
                            title="Code Block"
                        >
                            &lt;/&gt; Code
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const url = prompt("Enter URL:");
                                if (url) editor?.chain().focus().setLink({ href: url }).run();
                            }}
                            className={isActive('link')}
                            title="Add Link"
                        >
                            Link
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const imageUrl = prompt("Enter Image URL:");
                                if (imageUrl) editor?.chain().focus().setImage({ src: imageUrl }).run();
                            }}
                            title="Add Image"
                        >
                            Image
                        </button>
                    </div>
                    <EditorContent editor={editor} className={styles.textEditor} />
                </div>

                {/* File Upload Section - Kept separate as AskQuestion doesn't have file upload */}
                <div className={styles.fileUploadSection}>
                    <label htmlFor="fileUpload" className={styles.fileLabel}>
                        <span className={styles.fileLabelIcon}>📎</span>
                        Attach Files (JPEG, PNG, ZIP - max 5MB each)
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        className={styles.fileInput}
                        multiple
                        onChange={(e) => setFiles([...e.target.files])}
                        accept=".jpg,.jpeg,.png,.zip"
                    />
                    {files.length > 0 && (
                        <div className={styles.fileList}>
                            {files.map((file, index) => (
                                <div key={index} className={styles.fileItem}>
                                    <span className={styles.fileIcon}>📄</span>
                                    <span className={styles.fileName}>{file.name}</span>
                                    <span className={styles.fileSize}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                    <button
                                        type="button"
                                        className={styles.fileRemove}
                                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.buttonContainer}>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={uploading || !editor?.getText()?.trim()}
                    >
                        {uploading ? <span className={styles.loading}></span> : 'Submit Answer'}
                    </button>
                </div>
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
                        <motion.div
                            key={ans._id}
                            className={styles.answerCard}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.answerHeader}>
                                <div className={styles.answerAuthor}>
                                    <span className={styles.authorAvatar}>
                                        {ans.user?.username?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                    <div className={styles.authorInfo}>
                                        <span className={styles.authorName}>
                                            {ans.user?.username || "Anonymous"}
                                        </span>
                                        <span className={styles.answerDate}>
                                            {new Date(ans.createdAt).toLocaleDateString()} at{' '}
                                            {new Date(ans.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={styles.answerContent}
                                dangerouslySetInnerHTML={{ __html: ans.answerText }}
                            />

                            {ans.files?.length > 0 && (
                                <div className={styles.attachments}>
                                    <h5>Attachments:</h5>
                                    <div className={styles.fileLinks}>
                                        {ans.files.map((file, index) => (
                                            <a
                                                key={index}
                                                href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.fileLink}
                                            >
                                                <span className={styles.fileLinkIcon}>📄</span>
                                                {file.split('/').pop()}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.voteButtons}>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className={`${styles.voteButton} ${styles.upvoteButton} ${userVotes[ans._id] === "up" ? styles.upvoted : ""}`}
                                    onClick={() => handleVote(ans._id, "up")}
                                >
                                    <span className={styles.voteIcon}>👍</span>
                                    <span className={styles.voteCount}>{ans.upvotes || 0}</span>
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className={`${styles.voteButton} ${styles.downvoteButton} ${userVotes[ans._id] === "down" ? styles.downvoted : ""}`}
                                    onClick={() => handleVote(ans._id, "down")}
                                >
                                    <span className={styles.voteIcon}>👎</span>
                                    <span className={styles.voteCount}>{ans.downvotes || 0}</span>
                                </motion.button>
                            </div>

                            <div className={styles.commentSection}>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className={styles.commentInput}
                                    value={commentTexts[ans._id] || ""}
                                    onChange={(e) => setCommentTexts({ ...commentTexts, [ans._id]: e.target.value })}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && commentTexts[ans._id]?.trim()) {
                                            handleComment(ans._id);
                                        }
                                    }}
                                />
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className={styles.commentButton}
                                    onClick={() => handleComment(ans._id)}
                                    disabled={!commentTexts[ans._id]?.trim()}
                                >
                                    Post Comment
                                </motion.button>
                            </div>

                            {ans.comments?.length > 0 && (
                                <div className={styles.commentsList}>
                                    {ans.comments.map((c, index) => (
                                        <div key={index} className={styles.comment}>
                                            <div className={styles.commentAvatar}>
                                                {c.user?.username?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <div className={styles.commentContent}>
                                                <div className={styles.commentHeader}>
                                                    <strong>{c.user?.username || "Anonymous"}</strong>
                                                    <span className={styles.commentDate}>
                                                        {new Date(c.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className={styles.commentText}>{c.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className={styles.noAnswers}>
                        <span className={styles.noAnswersIcon}>💭</span>
                        <h4>No answers yet</h4>
                        <p>Be the first to answer this question!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default QuestionDetails;