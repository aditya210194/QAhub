// src/components/renderers/blocks/MarkdownBlock.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const MarkdownBlock = ({ block, index }) => {
    // Extract content safely - handle both string and object inputs
    let markdownContent = '';

    if (typeof block === 'string') {
        markdownContent = block;
    } else if (block?.content && typeof block.content === 'string') {
        markdownContent = block.content;
    } else if (block?.value && typeof block.value === 'string') {
        markdownContent = block.value;
    } else if (block?.data && typeof block.data === 'string') {
        markdownContent = block.data;
    } else if (block?.markdown && typeof block.markdown === 'string') {
        markdownContent = block.markdown;
    } else if (block?.text && typeof block.text === 'string') {
        markdownContent = block.text;
    } else {
        // If content is an object, try to stringify it safely
        try {
            markdownContent = JSON.stringify(block, null, 2);
        } catch (e) {
            markdownContent = 'Unable to render markdown content';
        }
    }

    if (!markdownContent || markdownContent === '{}') {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>📝 Markdown Block</strong>
                <div className="mt-1 text-muted small">No markdown content available.</div>
            </div>
        );
    }

    // Custom components for code blocks with copy button
    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
                return (
                    <div className="code-block-wrapper my-2">
                        <div className="code-header d-flex justify-content-between align-items-center mb-1">
                            <span className="badge bg-secondary">{match[1]}</span>
                            <CopyToClipboard text={codeString}>
                                <button className="btn btn-sm btn-outline-secondary copy-code-btn">
                                    <i className="fas fa-copy me-1"></i> Copy
                                </button>
                            </CopyToClipboard>
                        </div>
                        <SyntaxHighlighter
                            language={match[1]}
                            style={atomDark}
                            showLineNumbers
                            customStyle={{ borderRadius: '8px', fontSize: '13px' }}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            return <code className={className} {...props}>{children}</code>;
        },

        table({ children }) {
            return (
                <div className="table-responsive my-3">
                    <table className="table table-bordered table-striped">
                        {children}
                    </table>
                </div>
            );
        },

        img({ src, alt }) {
            return (
                <figure className="text-center my-3">
                    <img
                        src={src}
                        alt={alt || ''}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '400px' }}
                        loading="lazy"
                    />
                    {alt && <figcaption className="text-muted small mt-1">{alt}</figcaption>}
                </figure>
            );
        },

        blockquote({ children }) {
            return (
                <blockquote className="blockquote my-3 p-3 bg-light border-start border-4 border-primary">
                    {children}
                </blockquote>
            );
        }
    };

    return (
        <div className="markdown-block my-3">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
};

export default React.memo(MarkdownBlock);