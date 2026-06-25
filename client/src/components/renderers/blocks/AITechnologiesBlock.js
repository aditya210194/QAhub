import React, { useState } from 'react';

const AITechnologiesBlock = ({ block }) => {
    const { technologies } = block;
    const [expandedTech, setExpandedTech] = useState(null);

    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
        return <div className="alert alert-info my-3 p-3">No AI technologies available.</div>;
    }

    const getAccuracyColor = (accuracy) => {
        const value = parseInt(accuracy);
        if (value >= 90) return 'success';
        if (value >= 80) return 'warning';
        return 'danger';
    };

    return (
        <div className="ai-technologies-block my-4">
            <div className="row g-4">
                {technologies.map((tech, idx) => (
                    <div key={idx} className="col-lg-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <h5 className="text-white mb-0">{tech.technology}</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted small">{tech.description}</p>

                                <div className="mb-2">
                                    <span className="badge bg-info me-2">Accuracy: {tech['accuracy-level']}</span>
                                </div>

                                {tech['visual-testing-applications'] && (
                                    <div className="mb-3">
                                        <strong className="d-block mb-1">Applications:</strong>
                                        <ul className="list-unstyled small">
                                            {tech['visual-testing-applications'].map((app, i) => (
                                                <li key={i} className="mb-1">
                                                    <i className="fas fa-check-circle text-success me-1"></i>
                                                    {app}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {expandedTech === idx && tech['key-algorithms'] && (
                                    <div className="mt-2 p-2 bg-light rounded">
                                        <strong>Key Algorithms:</strong>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {tech['key-algorithms'].map((algo, i) => (
                                                <span key={i} className="badge bg-secondary">{algo}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button
                                    className="btn btn-sm btn-link text-decoration-none"
                                    onClick={() => setExpandedTech(expandedTech === idx ? null : idx)}
                                >
                                    {expandedTech === idx ? 'Hide Algorithms' : 'Show Algorithms'}
                                    <i className={`fas fa-chevron-${expandedTech === idx ? 'up' : 'down'} ms-1`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(AITechnologiesBlock);