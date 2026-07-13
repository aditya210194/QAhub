import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from '@tiptap/extension-table';
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import DOMPurify from "dompurify";
import { debounce } from "lodash";

const TiptapEditor = ({ content, onChange, placeholder }) => {
    const debouncedOnChange = useCallback(
        debounce((html) => {
            const sanitizedHtml = DOMPurify.sanitize(html); // Sanitize HTML
            onChange(sanitizedHtml);
        }, 500),
        [onChange]
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || "Write something...",
            }),
            Link.configure({
                openOnClick: true,
                autolink: true,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Code,
            CodeBlock,
            Bold, // Add bold formatting
            Italic, // Add italic formatting
            BulletList, // Add bullet lists
            OrderedList, // Add ordered lists
            Blockquote, // Add blockquotes
            Underline, // Add underline formatting
            Heading.configure({
                levels: [1, 2, 3], // Add heading levels 1, 2, and 3
            }),
            Highlight.configure({
                multicolor: true, // Enable multicolor highlight
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            debouncedOnChange(html); // Debounce the onChange event
        },
    });

    return <EditorContent editor={editor} />;
};

export default TiptapEditor;