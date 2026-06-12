// src/components/renderers/blocks/TemplateBlock.js
import React, { useState } from 'react';
import ContentRenderer from '../ContentRenderer';

const TemplateBlock = ({ block, index, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);

    // Safely extract values
    let title = '';
    let description = '';
    let content = '';
    let templateType = 'default';
    let version = '';
    let lastUpdated = '';

    if (typeof block === 'object') {
        title = block.title || '';
        description = block.description || '';
        content = block.content || block.template || '';
        templateType = block.variant || block.type || 'default';
        version = block.version || '';
        lastUpdated = block.lastUpdated || '';
    }

    if (!title && !content) {
        return (
            <div className="alert alert-info my-2 p-2">
                <strong>📋 Template</strong>
                <div className="mt-1 text-muted small">No template content available.</div>
            </div>
        );
    }

    const handleCopy = () => {
        if (content && typeof content === 'string') {
            navigator.clipboard.writeText(content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const variantStyles = {
        default: { border: 'border-primary', headerBg: 'bg-primary' },
        code: { border: 'border-dark', headerBg: 'bg-dark' },
        document: { border: 'border-info', headerBg: 'bg-info' },
        checklist: { border: 'border-success', headerBg: 'bg-success' },
    };

    const style = variantStyles[templateType] || variantStyles.default;

    return (
        <div className={`template-block card my-4 border ${style.border} shadow-sm`}>
            <div className={`card-header ${style.headerBg} text-white d-flex justify-content-between align-items-center`}>
                <div>
                    {title && <h5 className="mb-0">{title}</h5>}
                    {version && <small className="opacity-75 ms-2">v{version}</small>}
                </div>
                {content && typeof content === 'string' && (
                    <button className="btn btn-sm btn-light" onClick={handleCopy}>
                        <i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'} me-1`}></i>
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                )}
            </div>
            <div className="card-body">
                {description && <p className="text-muted small mb-3">{description}</p>}
                <div className="template-content">
                    {typeof content === 'string' ? (
                        templateType === 'code' ? (
                            <pre className="bg-dark text-light p-3 rounded" style={{ overflowX: 'auto' }}>
                                <code>{content}</code>
                            </pre>
                        ) : (
                            <ContentRenderer content={content} {...props} />
                        )
                    ) : (
                        <ContentRenderer content={content} {...props} />
                    )}
                </div>
            </div>
            {lastUpdated && (
                <div className="card-footer bg-transparent text-muted small">
                    <i className="fas fa-calendar-alt me-1"></i> Last updated: {lastUpdated}
                </div>
            )}
        </div>
    );
};

export default React.memo(TemplateBlock);