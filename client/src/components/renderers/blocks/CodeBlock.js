// src/components/renderers/blocks/CodeBlock.js
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CodeBlock = ({ block, index }) => {
    const [copied, setCopied] = useState(false);
    const code = block.code || block.value;
    const language = block.language || 'javascript';
    const showLineNumbers = block.showLineNumbers !== false;

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!code) return null;

    return (
        <div className="code-block-wrapper my-3">
            <div className="code-header d-flex justify-content-between align-items-center mb-1">
                <div className="language-tag">
                    <span className="badge bg-secondary">{language}</span>
                </div>
                <CopyToClipboard text={code} onCopy={handleCopy}>
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
                language={language}
                style={atomDark}
                PreTag="div"
                showLineNumbers={showLineNumbers}
                customStyle={{
                    margin: 0,
                    borderRadius: '8px',
                    fontSize: '14px'
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default React.memo(CodeBlock);