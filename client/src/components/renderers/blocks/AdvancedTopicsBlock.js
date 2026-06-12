import React, { useState } from 'react';

const AdvancedTopicsBlock = ({ block }) => {
    const { title, topics, variant = 'cards', difficulty = false } = block;
    const [expandedTopic, setExpandedTopic] = useState(null);

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
        return <div className="alert alert-info my-2 p-3">No advanced topics available.</div>;
    }

    const getDifficultyColor = (level) => {
        if (level === 'Advanced') return 'danger';
        if (level === 'Intermediate') return 'warning';
        return 'success';
    };

    if (variant === 'accordion') {
        return (
            <div className="advanced-topics-accordion my-4">
                {title && <h3 className="mb-4">{title}</h3>}
                <div className="accordion" id="advancedTopicsAccordion">
                    {topics.map((topic, idx) => (
                        <div key={idx} className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                                    {topic.icon && <i className={`${topic.icon} me-2 text-primary`}></i>}
                                    {topic.title}
                                    {difficulty && <span className={`badge bg-${getDifficultyColor(topic.difficulty)} ms-2`}>{topic.difficulty}</span>}
                                </button>
                            </h2>
                            <div id={`collapse${idx}`} className="accordion-collapse collapse" data-bs-parent="#advancedTopicsAccordion">
                                <div className="accordion-body">
                                    <p>{topic.description}</p>
                                    {topic.prerequisites && <div className="mt-2"><strong>Prerequisites:</strong> {topic.prerequisites}</div>}
                                    {topic.resources && <div className="mt-2"><strong>Resources:</strong> {topic.resources}</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="advanced-topics my-4">
            {title && <h3 className="mb-4 text-center">{title}</h3>}
            <div className="row g-4">
                {topics.map((topic, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm border-primary">
                            <div className="card-header bg-primary bg-opacity-10">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{topic.title}</h5>
                                    {difficulty && <span className={`badge bg-${getDifficultyColor(topic.difficulty)}`}>{topic.difficulty}</span>}
                                </div>
                            </div>
                            <div className="card-body">
                                <p>{topic.description}</p>
                                {topic.keyConcepts && (
                                    <div className="mt-2">
                                        <strong>Key Concepts:</strong>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {topic.keyConcepts.map((concept, i) => <span key={i} className="badge bg-light text-dark border">{concept}</span>)}
                                        </div>
                                    </div>
                                )}
                                {expandedTopic === idx && topic.details && (
                                    <div className="mt-3 p-2 bg-light rounded">
                                        <strong>Deep Dive:</strong>
                                        <p className="mt-1 mb-0 small">{topic.details}</p>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button className="btn btn-sm btn-link" onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}>
                                    {expandedTopic === idx ? 'Show less' : 'Learn more'}
                                    <i className={`fas fa-chevron-${expandedTopic === idx ? 'up' : 'down'} ms-1`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(AdvancedTopicsBlock);