import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import styles from "./AskQuestion.module.css";

const AskQuestion = () => {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Rich text editor setup
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
                placeholder: "Write your question in detail... Use the toolbar above to format your text."
            }),
        ],
        content: "",
    });

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const description = editor?.getHTML() || "";

        if (!title.trim() || !description.trim() || !tags.trim()) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        if (title.length < 10) {
            setError("Title must be at least 10 characters long.");
            setLoading(false);
            return;
        }

        if (description.length < 20) {
            setError("Description must be at least 20 characters long.");
            setLoading(false);
            return;
        }

        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/qa/questions`,
                {
                    title,
                    description,
                    tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                navigate("/community-features/qa");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Error posting question");
        } finally {
            setLoading(false);
        }
    };

    const isActive = (type, options = {}) => {
        return editor?.isActive(type, options) ? styles.isActive : '';
    };

    return (
        <div className={styles.askContainer}>
            <h2>Ask a Question</h2>

            {error && <div className={styles.error}>{error}</div>}

            <input
                type="text"
                placeholder="Enter your question title (minimum 10 characters)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.titleInput}
                maxLength={200}
            />
            <div className={styles.charCount}>{title.length}/200</div>

            <input
                type="text"
                placeholder="Enter tags separated by commas (e.g., react, javascript, testing)..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={styles.tagsInput}
            />

            <div className={styles.editorWrapper}>
                <div className={styles.toolbar}>
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={isActive('bold')}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={isActive('italic')}
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={isActive('underline')}
                        title="Underline"
                    >
                        <u>U</u>
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        H3
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={isActive('bulletList')}
                        title="Bullet List"
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={isActive('orderedList')}
                        title="Numbered List"
                    >
                        1. List
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className={isActive('blockquote')}
                        title="Quote"
                    >
                        &ldquo; Quote
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHighlight().run()}
                        className={isActive('highlight')}
                        title="Highlight"
                    >
                        Highlight
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                        className={isActive('codeBlock')}
                        title="Code Block"
                    >
                        &lt;/&gt; Code
                    </button>
                    <button
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

            <div className={styles.buttonContainer}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                    disabled={loading}
                >
                    Back
                </button>
                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <span className={styles.loading}></span> : 'Submit Question'}
                </button>
            </div>
        </div>
    );
};

export default AskQuestion;