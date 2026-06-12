// src/components/renderers/blocks/QaBlock.js
import React, { useState } from 'react';

const QaBlock = ({ block, index }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const { title, items, variant = 'accordion', showAll = false } = block;

    const toggleItem = (itemIndex) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemIndex]: !prev[itemIndex]
        }));
    };

    const expandAll = () => {
        const allExpanded = {};
        items?.forEach((_, idx) => { allExpanded[idx] = true; });
        setExpandedItems(allExpanded);
    };

    const collapseAll = () => {
        setExpandedItems({});
    };

    const variantStyles = {
        accordion: { container: 'card mb-2', question: 'card-header bg-light cursor-pointer', answer: 'card-body' },
        simple: { container: 'mb-3', question: 'fw-bold', answer: 'mt-1' },
        card: { container: 'card mb-3 border-primary', question: 'card-header bg-primary bg-opacity-10', answer: 'card-body' },
    };

    const styles = variantStyles[variant] || variantStyles.accordion;

    return (
        <div className="qa-block my-4">
            {title && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">{title}</h4>
                    {variant === 'accordion' && items?.length > 1 && (
                        <div>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={expandAll}>
                                Expand All
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={collapseAll}>
                                Collapse All
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="qa-items">
                {items?.map((item, idx) => {
                    const isExpanded = showAll || expandedItems[idx];
                    return (
                        <div key={idx} className={styles.container}>
                            <div
                                className={`${styles.question} ${variant === 'accordion' ? 'cursor-pointer' : ''}`}
                                onClick={() => variant === 'accordion' && toggleItem(idx)}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>Q{idx + 1}: {item.question}</strong>
                                    {variant === 'accordion' && (
                                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-muted`}></i>
                                    )}
                                </div>
                            </div>
                            {(isExpanded || variant !== 'accordion') && (
                                <div className={styles.answer}>
                                    <div className="mb-2">
                                        <span className="fw-bold text-success">Answer:</span>
                                    </div>
                                    <div>{item.answer}</div>
                                    {item.code && (
                                        <pre className="mt-2 p-2 bg-dark text-light rounded small overflow-auto">
                                            <code>{item.code}</code>
                                        </pre>
                                    )}
                                    {item.reference && (
                                        <div className="mt-2 small text-muted">
                                            <i className="fas fa-link me-1"></i> Reference: {item.reference}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(QaBlock);