// src/components/renderers/utils/rendererUtils.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';

// ==================== Helper Functions ====================

export const getDifficultyColor = (difficulty = '') => {
    const diff = difficulty.toLowerCase();
    const map = {
        beginner: 'success',
        intermediate: 'warning',
        advanced: 'danger',
        expert: 'dark',
        easy: 'success',
        medium: 'warning',
        hard: 'danger'
    };
    return map[diff] || 'primary';
};

export const getStatusBadgeClass = (status = '') => {
    const map = {
        new: 'badge-status-new',
        updated: 'badge-status-updated',
        deprecated: 'badge-status-deprecated',
        experimental: 'badge-status-experimental'
    };
    return map[status] || 'bg-secondary';
};

export const getLevelBadge = (level) => {
    switch((level || '').toLowerCase()) {
        case 'beginner': return 'primary';
        case 'intermediate': return 'warning';
        case 'advanced': return 'danger';
        default: return 'secondary';
    }
};

export const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// ==================== Markdown Components ====================

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const id = uuidv4();
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return !inline && match ? (
        <div className="code-block-wrapper">
            <div className="code-header d-flex justify-content-between align-items-center">
                <div className="language-tag">
                    <span className="badge bg-secondary">{match[1]}</span>
                </div>
                <CopyToClipboard text={String(children).replace(/\n$/, '')} onCopy={handleCopy}>
                    <button className="copy-button btn btn-sm btn-outline-secondary">
                        {copied ? (
                            <><i className="fas fa-check me-1"></i> Copied!</>
                        ) : (
                            <><i className="fas fa-copy me-1"></i> Copy</>
                        )}
                    </button>
                </CopyToClipboard>
            </div>
            <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                showLineNumbers
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};

export const markdownComponents = {
    code: CodeBlock,

    table({ children }) {
        return (
            <div className="table-responsive my-3">
                <table className="table table-striped table-bordered">{children}</table>
            </div>
        );
    },

    img({ src, alt, title }) {
        return (
            <figure className="text-center my-4">
                <img
                    src={src}
                    alt={alt || ''}
                    className="img-fluid rounded"
                    style={{ maxHeight: '400px' }}
                    loading="lazy"
                />
                {title && <figcaption className="mt-2 text-muted">{title}</figcaption>}
            </figure>
        );
    },

    blockquote({ children }) {
        return (
            <blockquote className="blockquote my-3 p-3 bg-light border-start border-5 border-primary">
                {children}
            </blockquote>
        );
    },

    h1({ children }) {
        return <h1 className="my-4">{children}</h1>;
    },

    h2({ children }) {
        return <h2 className="my-3">{children}</h2>;
    },

    h3({ children }) {
        return <h3 className="my-2">{children}</h3>;
    },

    ul({ children }) {
        return <ul className="mb-3">{children}</ul>;
    },

    ol({ children }) {
        return <ol className="mb-3">{children}</ol>;
    },

    a({ href, children }) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary">
                {children}
            </a>
        );
    }
};

// ==================== Style Objects ====================

export const getCodeStyle = (darkMode) => ({
    ...atomDark,
    'pre[class*="language-"]': {
        ...atomDark['pre[class*="language-"]'],
        background: darkMode ? '#1a1a2e' : '#0d1117',
        borderRadius: '8px',
        fontSize: '14px'
    }
});