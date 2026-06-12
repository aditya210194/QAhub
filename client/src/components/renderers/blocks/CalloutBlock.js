// src/components/renderers/blocks/CalloutBlock.js
import React from 'react';

const CalloutBlock = ({ block, index }) => {
    const { title, content, variant = 'info', icon, dismissible = false } = block;

    const variantStyles = {
        info: { bg: 'bg-info', text: 'text-info', icon: 'fa-info-circle', border: 'border-info' },
        success: { bg: 'bg-success', text: 'text-success', icon: 'fa-check-circle', border: 'border-success' },
        warning: { bg: 'bg-warning', text: 'text-warning', icon: 'fa-exclamation-triangle', border: 'border-warning' },
        danger: { bg: 'bg-danger', text: 'text-danger', icon: 'fa-times-circle', border: 'border-danger' },
        note: { bg: 'bg-primary', text: 'text-primary', icon: 'fa-pen', border: 'border-primary' },
        tip: { bg: 'bg-secondary', text: 'text-secondary', icon: 'fa-lightbulb', border: 'border-secondary' },
    };

    const style = variantStyles[variant] || variantStyles.info;

    return (
        <div className={`callout-block my-4 p-3 ${style.bg} bg-opacity-10 rounded border ${style.border}`}>
            <div className="d-flex">
                <div className="callout-icon me-3">
                    <i className={`fas ${icon || style.icon} ${style.text} fa-2x`}></i>
                </div>
                <div className="callout-content flex-grow-1">
                    {title && <h6 className={`${style.text} mb-2`}>{title}</h6>}
                    <div className="callout-text">
                        {typeof content === 'string' ? content : content?.map((item, idx) => (
                            <p key={idx} className="mb-2">{item}</p>
                        ))}
                    </div>
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