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
            Link,
            CodeBlock,
            Image,
            Placeholder.configure({ placeholder: "Start typing your question..." })
        ],
        content: "",
    });

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const description = editor?.getHTML() || "";

        if (!title.trim() || !description.trim() || !tags.trim()) {
            setError("All fields are required.");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                setError("Authentication token not found. Please log in.");
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/qa/questions`,
                {
                    title,
                    description,
                    tags: tags.split(",").map(tag => tag.trim())
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                navigate("/community-features/qa"); // Redirect to Q&A page
            }
        } catch (err) {
            setError(err.response?.data?.error || "Error posting question");
        }
    };

    return (
        <div className={styles.askContainer}>
            <h2>Ask a Question</h2>

            {error && <p className={styles.error}>{error}</p>}

            <input
                type="text"
                placeholder="Enter your question title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.titleInput}
            />

            <input
                type="text"
                placeholder="Enter tags separated by commas..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={styles.tagsInput}
            />

            <div className={styles.editorWrapper}>
                <div className={styles.toolbar}>
                    <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo; Quote</button>
                    <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
                    <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
                    <button onClick={() => {
                        const url = prompt("Enter URL:");
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}>Link</button>
                    <button onClick={() => {
                        const imageUrl = prompt("Enter Image URL:");
                        if (imageUrl) editor.chain().focus().setImage({ src: imageUrl }).run();
                    }}>Image</button>
                </div>
                <EditorContent editor={editor} className={styles.textEditor} />
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.backButton} onClick={() => navigate(-1)}> Back</button>
                <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default AskQuestion;
