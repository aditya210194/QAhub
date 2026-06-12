// src/components/renderers/blocks/DefinitionListBlock.js
import React, { useState } from 'react';

const DefinitionListBlock = ({ block, index }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const { title, items, variant = 'default', collapsible = false } = block;

    const toggleItem = (itemIndex) => {
        if (collapsible) {
            setExpandedItems(prev => ({
                ...prev,
                [itemIndex]: !prev[itemIndex]
            }));
        }
    };

    const variantStyles = {
        default: { container: '', term: 'fw-bold', definition: 'text-muted' },
        glossary: { container: 'border-bottom py-2', term: 'h6', definition: '' },
        flashcards: { container: 'card mb-2', term: 'card-header bg-primary bg-opacity-10', definition: 'card-body' },
        compact: { container: 'row mb-2', term: 'col-4 fw-bold', definition: 'col-8' },
    };

    const styles = variantStyles[variant] || variantStyles.default;

    return (
        <div className="definition-list-block my-4">
            {title && <h4 className="mb-3">{title}</h4>}
            <dl className={`definition-list ${variant}`}>
                {items?.map((item, idx) => (
                    <div
                        key={idx}
                        className={`definition-item ${styles.container} ${collapsible ? 'cursor-pointer' : ''}`}
                        onClick={() => collapsible && toggleItem(idx)}
                    >
                        <dt className={styles.term}>
                            {item.term}
                            {collapsible && (
                                <i className={`fas fa-chevron-${expandedItems[idx] ? 'up' : 'down'} ms-2 small text-muted`}></i>
                            )}
                        </dt>
                        {(!collapsible || expandedItems[idx]) && (
                            <dd className={`${styles.definition} mt-1`}>
                                {item.definition}
                                {item.example && (
                                    <div className="example mt-2 p-2 bg-light rounded small">
                                        <strong>Example:</strong> {item.example}
                                    </div>
                                )}
                                {item.note && (
                                    <div className="note mt-1 small text-info">
                                        <i className="fas fa-info-circle me-1"></i> {item.note}
                                    </div>
                                )}
                            </dd>
                        )}
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default React.memo(DefinitionListBlock);