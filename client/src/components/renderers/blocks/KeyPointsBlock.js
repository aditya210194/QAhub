import React, { useState } from 'react';

const KeyPointsBlock = ({ block, index }) => {
    const [expanded, setExpanded] = useState(false);

    const getPriorityColor = (priority) => {
        const map = { high: 'danger', medium: 'warning', low: 'info' };
        return map[priority] || 'secondary';
    };

    return (
        <div className="key-points-section my-4">
            {block.title && (
                <h3 className="key-points-title mb-3">
                    {block.icon && <i className={`key-points-icon ${block.icon} me-2`}></i>}
                    {block.title}
                </h3>
            )}
            <div className="key-points-grid">
                {block.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className={`key-point-card ${item.type || 'info'} p-3 border rounded mb-3`} data-priority={item.priority || 'medium'}>
                        <div className="key-point-header d-flex align-items-center mb-2">
                            {item.icon ? (
                                <div className="key-point-icon me-2"><i className={item.icon}></i></div>
                            ) : (
                                <div className="key-point-bullet me-2"><span className="badge bg-primary rounded-circle">{itemIndex + 1}</span></div>
                            )}
                            <h4 className="key-point-title mb-0">
                                {item.title}
                                {item.badge && <span className="key-point-badge ms-2 badge bg-secondary">{item.badge}</span>}
                            </h4>
                        </div>
                        <div className="key-point-content">
                            <p className="key-point-description">{item.description}</p>
                            {item.details && expanded && <div className="key-point-details mt-2 p-2 bg-light rounded"><ReactMarkdown>{item.details}</ReactMarkdown></div>}
                            {item.example && <div className="key-point-example mt-2 small text-muted"><strong>Example:</strong> {item.example}</div>}
                            {item.stats && (
                                <div className="key-point-stats mt-2 d-flex gap-3">
                                    {Object.entries(item.stats).map(([key, value]) => <div key={key} className="stat-item text-center"><div className="stat-value h5 mb-0 text-primary">{value}</div><div className="stat-label small text-muted">{key}</div></div>)}
                                </div>
                            )}
                        </div>
                        {item.tags && <div className="key-point-tags mt-2">{item.tags.map((tag, i) => <span key={i} className="badge bg-secondary me-1">{tag}</span>)}</div>}
                    </div>
                ))}
            </div>
            {block.footer && expanded && <div className="key-points-footer mt-3 p-2 bg-light rounded"><ReactMarkdown>{block.footer}</ReactMarkdown></div>}
            {block.items?.length > 3 && (
                <div className="text-center mt-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setExpanded(!expanded)}>
                        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} me-1`}></i>
                        {expanded ? 'Show Less' : `Show ${block.items.length - 3} More`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(KeyPointsBlock);