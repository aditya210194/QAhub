// src/components/renderers/blocks/CalloutBlock.js
import React from 'react';

const CalloutBlock = ({ block, index }) => {
    const { title, content, variant = 'info', icon, dismissible = false, link, footnote } = block;

    const variantStyles = {
        info: { bg: 'bg-info', text: 'text-info', icon: 'fa-info-circle', border: 'border-info' },
        success: { bg: 'bg-success', text: 'text-success', icon: 'fa-check-circle', border: 'border-success' },
        warning: { bg: 'bg-warning', text: 'text-warning', icon: 'fa-exclamation-triangle', border: 'border-warning' },
        danger: { bg: 'bg-danger', text: 'text-danger', icon: 'fa-times-circle', border: 'border-danger' },
        note: { bg: 'bg-primary', text: 'text-primary', icon: 'fa-pen', border: 'border-primary' },
        tip: { bg: 'bg-secondary', text: 'text-secondary', icon: 'fa-lightbulb', border: 'border-secondary' },
    };

    const style = variantStyles[variant] || variantStyles.info;

    const renderContentItem = (item, idx) => {
        // Handle string content
        if (typeof item === 'string') {
            return <p key={idx} className="mb-2">{item}</p>;
        }

        // Handle metric objects
        if (item.type === 'metric') {
            return (
                <div key={idx} className="metric-display my-2 p-3 bg-white rounded shadow-sm">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <span className="text-muted small">{item.title}</span>
                            <div className="d-flex align-items-center">
                                <span className="h3 mb-0 me-2" style={{ fontWeight: 'bold' }}>
                                    {item.value}
                                </span>
                                {item.trend === 'up' && <i className="fas fa-arrow-up text-success"></i>}
                                {item.trend === 'down' && <i className="fas fa-arrow-down text-danger"></i>}
                                {item.trend === 'neutral' && <i className="fas fa-minus text-warning"></i>}
                            </div>
                            <div className="text-muted small">{item.source}</div>
                        </div>
                        {item.icon && <i className={`${item.icon} fa-2x text-primary opacity-50`}></i>}
                    </div>
                    {item.description && (
                        <div className="text-muted small mt-1">{item.description}</div>
                    )}
                </div>
            );
        }

        // Handle checklist objects
        if (item.type === 'checklist') {
            return (
                <div key={idx} className="checklist-display my-2">
                    {item.title && <h6 className="mb-2">{item.title}</h6>}
                    <ul className="list-unstyled mb-0">
                        {Array.isArray(item.items) && item.items.map((checkItem, checkIdx) => (
                            <li key={checkIdx} className="mb-1">
                                <i className={`fas ${checkItem.status === 'checked' ? 'fa-check-circle text-success' : 'fa-circle text-muted'} me-2`}></i>
                                {checkItem.item}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        // Handle custom objects (fallback)
        if (typeof item === 'object') {
            return (
                <div key={idx} className="custom-content my-2 p-2 bg-white bg-opacity-25 rounded">
                    <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(item, null, 2)}
                    </pre>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`callout-block my-4 p-3 ${style.bg} bg-opacity-10 rounded border ${style.border}`}>
            <div className="d-flex">
                <div className="callout-icon me-3">
                    <i className={`fas ${icon || style.icon} ${style.text} fa-2x`}></i>
                </div>
                <div className="callout-content flex-grow-1">
                    {title && <h6 className={`${style.text} mb-2`}>{title}</h6>}
                    <div className="callout-text">
                        {Array.isArray(content) ? content.map(renderContentItem) : content}
                    </div>

                    {/* Render link if provided */}
                    {link && (
                        <div className="mt-3">
                            <a href={link.url} className="btn btn-sm btn-outline-primary" target="_blank" rel="noopener noreferrer">
                                <i className="fas fa-external-link-alt me-1"></i>
                                {link.text || 'Learn More'}
                            </a>
                        </div>
                    )}

                    {/* Render footnote if provided */}
                    {footnote && (
                        <div className="text-muted small mt-2">
                            <i className="fas fa-info-circle me-1"></i>
                            {footnote}
                        </div>
                    )}
                </div>
                {dismissible && (
                    <button className="btn btn-sm btn-link text-muted">
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(CalloutBlock);