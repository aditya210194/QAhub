// src/components/renderers/blocks/TipBoxBlock.js
import React, { useState } from 'react';

const TipBoxBlock = ({ block, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { title, tips, variant = 'default', collapsible = false } = block;

    if (!tips || !Array.isArray(tips) || tips.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>💡 Tip Box</strong>
                <div className="mt-1 text-muted small">No tips available.</div>
            </div>
        );
    }

    const variantStyles = {
        default: { bg: 'bg-info', icon: 'fa-lightbulb', border: 'border-info', textColor: 'text-primary' },
        success: { bg: 'bg-success', icon: 'fa-check-circle', border: 'border-success', textColor: 'text-success' },
        warning: { bg: 'bg-warning', icon: 'fa-exclamation-triangle', border: 'border-warning', textColor: 'text-warning' },
        danger: { bg: 'bg-danger', icon: 'fa-times-circle', border: 'border-danger', textColor: 'text-danger' },
    };

    const style = variantStyles[variant] || variantStyles.default;
    const displayTips = isExpanded ? tips : tips.slice(0, 3);

    // Convert string tips to objects if needed
    const formattedTips = displayTips.map(tip => {
        if (typeof tip === 'string') {
            return { icon: 'fa-star', content: tip };
        }
        // Handle both 'text' and 'content' properties
        return {
            icon: tip.icon || 'fa-star',
            content: tip.text || tip.content || '',
            title: tip.title || null
        };
    });

    return (
        <div className={`tip-box card my-4 border ${style.border} shadow-sm`}>
            <div className={`card-header ${style.bg} bg-opacity-10 d-flex justify-content-between align-items-center`}>
                <div className="d-flex align-items-center">
                    <i className={`fas ${style.icon} me-2 ${style.textColor}`}></i>
                    <h5 className="mb-0">{title || 'Pro Tips'}</h5>
                </div>
                {collapsible && tips.length > 3 && (
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Show Less' : `Show ${tips.length - 3} More`}
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ms-1`}></i>
                    </button>
                )}
            </div>
            <div className="card-body">
                <ul className="list-unstyled mb-0">
                    {formattedTips.map((tip, idx) => (
                        <li key={idx} className="mb-3 pb-3 border-bottom">
                            <div className="d-flex">
                                <div className="tip-icon me-3 mt-1">
                                    <i className={`${tip.icon || 'fa-star'} text-warning`}></i>
                                </div>
                                <div className="tip-text">
                                    {tip.title && <strong>{tip.title}</strong>}
                                    <p className="mb-0 text-muted small mt-1">{tip.content}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(TipBoxBlock);