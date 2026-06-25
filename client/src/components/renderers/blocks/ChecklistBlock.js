// src/components/renderers/blocks/ChecklistBlock.js
import React, { useState } from 'react';

const ChecklistBlock = ({ block, index }) => {
    const [checkedItems, setCheckedItems] = useState({});

    // Safely extract values
    let title = '';
    let items = [];
    let variant = 'default';
    let showProgress = true;

    if (typeof block === 'object') {
        title = block.title || '';
        items = Array.isArray(block.items) ? block.items : (Array.isArray(block.checklist) ? block.checklist : []);
        variant = block.variant || 'default';
        showProgress = block.showProgress !== false;
    }

    if (!items || items.length === 0) {
        return (
            <div className="alert alert-info my-2 p-2">
                <strong>✅ Checklist</strong>
                <div className="mt-1 text-muted small">No checklist items available.</div>
            </div>
        );
    }

    const toggleItem = (index) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleAll = () => {
        const allChecked = Object.keys(checkedItems).length === items.length &&
            Object.values(checkedItems).every(v => v === true);
        const newState = {};
        if (!allChecked) {
            items.forEach((_, idx) => { newState[idx] = true; });
        }
        setCheckedItems(newState);
    };

    const resetAll = () => {
        setCheckedItems({});
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    const variantStyles = {
        default: { bg: 'bg-white', border: 'border-secondary' },
        card: { bg: 'bg-light', border: 'border-primary', rounded: true },
        minimal: { bg: 'transparent', border: 'border-0' },
    };

    const style = variantStyles[variant] || variantStyles.default;

    // Helper function to get item text from various possible properties
    const getItemText = (item) => {
        if (typeof item === 'string') return item;
        return item.item || item.text || item.title || item.label || `Item ${index + 1}`;
    };

    // Helper function to get item description
    const getItemDescription = (item) => {
        if (typeof item === 'object') {
            return item.description || item.desc || '';
        }
        return '';
    };

    return (
        <div className={`checklist-block my-4 p-3 ${style.bg} ${style.border ? 'border' : ''} rounded ${style.rounded ? 'shadow-sm' : ''}`}>
            {title && <h4 className="mb-3">{title}</h4>}

            {showProgress && items.length > 0 && (
                <div className="checklist-progress mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Progress</span>
                        <span className="text-primary">{completedCount}/{items.length} completed</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                        <div
                            className="progress-bar bg-primary"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="checklist-items">
                {items.map((item, idx) => {
                    const itemText = getItemText(item);
                    const itemDescription = getItemDescription(item);
                    const isChecked = checkedItems[idx] || false;

                    // Get additional fields if they exist
                    const frequency = typeof item === 'object' ? item.frequency : null;
                    const owner = typeof item === 'object' ? item.owner : null;

                    return (
                        <div key={idx} className={`checklist-item d-flex mb-2 p-2 rounded ${isChecked ? 'bg-success bg-opacity-10' : ''}`}>
                            <div className="checklist-checkbox me-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input mt-1"
                                    checked={isChecked}
                                    onChange={() => toggleItem(idx)}
                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                />
                            </div>
                            <div className="checklist-content flex-grow-1">
                                <div className={`checklist-text ${isChecked ? 'text-decoration-line-through text-muted' : ''}`}>
                                    {itemText}
                                </div>
                                {(frequency || owner) && (
                                    <div className="checklist-meta small text-muted mt-1">
                                        {frequency && <span className="me-3"><i className="fas fa-clock me-1"></i>{frequency}</span>}
                                        {owner && <span><i className="fas fa-user me-1"></i>{owner}</span>}
                                    </div>
                                )}
                                {itemDescription && !isChecked && (
                                    <div className="checklist-description small text-muted mt-1">
                                        {itemDescription}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {items.length > 1 && (
                <div className="checklist-actions mt-3 d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={toggleAll}>
                        <i className="fas fa-check-double me-1"></i>
                        {completedCount === items.length ? 'Uncheck All' : 'Check All'}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={resetAll}>
                        <i className="fas fa-undo me-1"></i>
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(ChecklistBlock);