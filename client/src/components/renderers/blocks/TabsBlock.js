// src/components/renderers/blocks/TabsBlock.js
import React, { useState } from 'react';
import ContentRenderer from '../ContentRenderer';

const TabsBlock = ({ block, index, ...props }) => {
    const [activeTab, setActiveTab] = useState(0);
    const { title, tabs, variant = 'default' } = block;

    if (!tabs || !Array.isArray(tabs) || tabs.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>📑 Tabs</strong>
                <div className="mt-1 text-muted small">No tab content available.</div>
            </div>
        );
    }

    const variantStyles = {
        default: { tabClass: 'nav-tabs', contentClass: 'tab-content p-3 border border-top-0 rounded-bottom' },
        pills: { tabClass: 'nav-pills', contentClass: 'tab-content p-3' },
        underlined: { tabClass: 'nav-tabs border-bottom-0', contentClass: 'tab-content p-3' },
    };

    const styles = variantStyles[variant] || variantStyles.default;

    return (
        <div className="tabs-block my-4">
            {title && <h4 className="mb-3">{title}</h4>}
            <ul className={`nav ${styles.tabClass}`}>
                {tabs.map((tab, idx) => (
                    <li key={idx} className="nav-item">
                        <button
                            className={`nav-link ${activeTab === idx ? 'active' : ''}`}
                            onClick={() => setActiveTab(idx)}
                            type="button"
                        >
                            {tab.icon && <i className={`${tab.icon} me-2`}></i>}
                            {tab.title}
                            {tab.badge && <span className="badge bg-secondary ms-2">{tab.badge}</span>}
                        </button>
                    </li>
                ))}
            </ul>
            <div className={styles.contentClass}>
                {tabs[activeTab] && (
                    <ContentRenderer content={tabs[activeTab].content} {...props} />
                )}
            </div>
        </div>
    );
};

export default React.memo(TabsBlock);