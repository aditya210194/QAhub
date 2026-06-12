// src/components/renderers/blocks/TechniqueCardsBlock.js
import React, { useState } from 'react';

const TechniqueCardsBlock = ({ block, index }) => {
    const [expandedCard, setExpandedCard] = useState(null);

    // Safely extract values
    let title = '';
    let techniques = [];
    let variant = 'cards';

    if (typeof block === 'object') {
        title = block.title || '';
        techniques = Array.isArray(block.techniques) ? block.techniques : (Array.isArray(block.items) ? block.items : []);
        variant = block.variant || 'cards';
    }

    if (!techniques || techniques.length === 0) {
        return (
            <div className="alert alert-info my-2 p-2">
                <strong>🃏 Technique Cards</strong>
                <div className="mt-1 text-muted small">No technique data available.</div>
            </div>
        );
    }

    const getDifficultyColor = (difficulty) => {
        if (!difficulty) return 'secondary';
        const lowerDiff = String(difficulty).toLowerCase();
        if (lowerDiff === 'beginner' || lowerDiff === 'easy') return 'success';
        if (lowerDiff === 'intermediate' || lowerDiff === 'medium') return 'warning';
        if (lowerDiff === 'advanced' || lowerDiff === 'hard') return 'danger';
        return 'info';
    };

    if (variant === 'list') {
        return (
            <div className="technique-list my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="list-group">
                    {techniques.map((tech, idx) => {
                        const techName = typeof tech === 'string' ? tech : tech.name || tech.title || `Technique ${idx + 1}`;
                        const techDescription = typeof tech === 'object' ? tech.description : '';
                        const techDifficulty = typeof tech === 'object' ? tech.difficulty || tech.level : '';

                        return (
                            <div key={idx} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-start flex-wrap">
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{techName}</h6>
                                        {techDescription && <p className="mb-0 small text-muted">{techDescription}</p>}
                                    </div>
                                    {techDifficulty && (
                                        <span className={`badge bg-${getDifficultyColor(techDifficulty)} ms-2`}>
                                            {techDifficulty}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Cards variant (default)
    return (
        <div className="technique-cards my-4">
            {title && <h4 className="mb-4 text-center">{title}</h4>}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {techniques.map((tech, idx) => {
                    const techName = typeof tech === 'string' ? tech : tech.name || tech.title || `Technique ${idx + 1}`;
                    const techDescription = typeof tech === 'object' ? tech.description : '';
                    const techDetails = typeof tech === 'object' ? tech.details || tech.content : '';
                    const techDifficulty = typeof tech === 'object' ? tech.difficulty || tech.level : '';
                    const techSteps = typeof tech === 'object' && Array.isArray(tech.steps) ? tech.steps : [];
                    const techExample = typeof tech === 'object' ? tech.example : '';
                    const techIcon = typeof tech === 'object' ? tech.icon : 'fa-code';
                    const isExpanded = expandedCard === idx;

                    return (
                        <div key={idx} className="col">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-primary bg-opacity-10 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <i className={`fas ${techIcon} text-primary me-2`}></i>
                                        <h6 className="mb-0">{techName}</h6>
                                    </div>
                                    {techDifficulty && (
                                        <span className={`badge bg-${getDifficultyColor(techDifficulty)}`}>
                                            {techDifficulty}
                                        </span>
                                    )}
                                </div>
                                <div className="card-body">
                                    <p className="card-text small">{techDescription}</p>

                                    {techSteps.length > 0 && (
                                        <div className="technique-steps mt-2">
                                            <small className="text-muted">Key steps:</small>
                                            <ul className="small mb-0 mt-1 ps-3">
                                                {techSteps.slice(0, isExpanded ? undefined : 2).map((step, stepIdx) => (
                                                    <li key={stepIdx}>{step}</li>
                                                ))}
                                                {!isExpanded && techSteps.length > 2 && (
                                                    <li className="text-primary cursor-pointer" onClick={() => setExpandedCard(idx)}>
                                                        + {techSteps.length - 2} more...
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {isExpanded && techDetails && (
                                        <div className="technique-details mt-2 p-2 bg-light rounded small">
                                            {techDetails}
                                        </div>
                                    )}

                                    {techExample && (
                                        <div className="technique-example mt-2 p-2 bg-info bg-opacity-10 rounded small">
                                            <strong className="text-info">Example:</strong> {techExample}
                                        </div>
                                    )}
                                </div>
                                {(techSteps.length > 2 || techDetails) && (
                                    <div className="card-footer bg-transparent border-top-0 text-center">
                                        <button
                                            className="btn btn-sm btn-link text-primary"
                                            onClick={() => setExpandedCard(isExpanded ? null : idx)}
                                        >
                                            {isExpanded ? 'Show Less' : 'Show More'}
                                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ms-1`}></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(TechniqueCardsBlock);