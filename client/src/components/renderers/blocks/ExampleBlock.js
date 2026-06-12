// src/components/renderers/blocks/ExampleBlock.js
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ExampleBlock = ({ block, index }) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { title, type = 'good', code, language = 'javascript', description, scenario, problem, solution, prevention, details, note } = block;

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const variantStyles = {
        good: { headerBg: 'bg-success', icon: 'fa-check-circle', border: 'border-success' },
        bad: { headerBg: 'bg-danger', icon: 'fa-times-circle', border: 'border-danger' },
        best: { headerBg: 'bg-info', icon: 'fa-star', border: 'border-info' },
        default: { headerBg: 'bg-primary', icon: 'fa-lightbulb', border: 'border-primary' },
    };

    const style = variantStyles[type] || variantStyles.default;

    return (
        <div className={`example-block card my-4 border ${style.border}`}>
            <div className={`card-header ${style.headerBg} bg-opacity-10 d-flex justify-content-between align-items-center`}>
                <div className="d-flex align-items-center">
                    <i className={`fas ${style.icon} me-2 ${type === 'bad' ? 'text-danger' : type === 'good' ? 'text-success' : 'text-primary'}`}></i>
                    <h5 className="mb-0">{title || (type === 'good' ? 'Good Example' : type === 'bad' ? 'Bad Example' : 'Example')}</h5>
                </div>
                {code && (
                    <CopyToClipboard text={code} onCopy={handleCopy}>
                        <button className="btn btn-sm btn-outline-secondary">
                            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                            {copied ? ' Copied!' : ' Copy'}
                        </button>
                    </CopyToClipboard>
                )}
            </div>
            <div className="card-body">
                {scenario && (
                    <div className="example-scenario mb-3">
                        <strong className="text-primary">Scenario:</strong>
                        <p className="mt-1 mb-0">{scenario}</p>
                    </div>
                )}
                {problem && (
                    <div className="example-problem mb-3">
                        <strong className="text-danger">Problem:</strong>
                        <p className="mt-1 mb-0">{problem}</p>
                    </div>
                )}
                {solution && (
                    <div className="example-solution mb-3">
                        <strong className="text-success">Solution:</strong>
                        <p className="mt-1 mb-0">{solution}</p>
                    </div>
                )}
                {prevention && (
                    <div className="example-prevention mb-3">
                        <strong className="text-info">Prevention:</strong>
                        <p className="mt-1 mb-0">{prevention}</p>
                    </div>
                )}
                {description && !scenario && !problem && (
                    <div className="example-description mb-3">
                        <p>{description}</p>
                    </div>
                )}
                {code && (
                    <div className="example-code mt-3">
                        <div className="code-header d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">{language}</small>
                        </div>
                        <SyntaxHighlighter
                            language={language}
                            style={atomDark}
                            showLineNumbers
                            customStyle={{ borderRadius: '8px', fontSize: '13px' }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                )}
                {note && (
                    <div className="example-note mt-3 p-2 bg-light rounded small">
                        <i className="fas fa-lightbulb text-warning me-1"></i> <strong>Note:</strong> {note}
                    </div>
                )}
                {details && expanded && (
                    <div className="example-details mt-3 p-3 bg-light rounded">
                        <strong>Details:</strong>
                        <div dangerouslySetInnerHTML={{ __html: details }} />
                    </div>
                )}
                {details && !expanded && (
                    <button className="btn btn-sm btn-link mt-2 p-0" onClick={() => setExpanded(true)}>
                        Show more details <i className="fas fa-chevron-down ms-1"></i>
                    </button>
                )}
                {expanded && details && (
                    <button className="btn btn-sm btn-link mt-2 p-0" onClick={() => setExpanded(false)}>
                        Show less <i className="fas fa-chevron-up ms-1"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(ExampleBlock);