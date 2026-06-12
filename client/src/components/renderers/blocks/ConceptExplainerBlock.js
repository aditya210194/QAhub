// src/components/renderers/blocks/ConceptExplainerBlock.js
import React, { useState } from 'react';

const ConceptExplainerBlock = ({ block, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAnalogy, setShowAnalogy] = useState(false);

    // Safely extract values
    let title = '';
    let concept = '';
    let explanation = '';
    let analogy = '';
    let example = '';
    let difficulty = '';
    let keyPoints = [];
    let commonMisconceptions = [];
    let relatedConcepts = [];
    let visualUrl = '';

    if (typeof block === 'object') {
        title = block.title || block.concept || '';
        concept = block.concept || block.term || '';
        explanation = block.explanation || block.content || '';
        analogy = block.analogy || '';
        example = block.example || '';
        difficulty = block.difficulty || block.level || 'Beginner';
        keyPoints = Array.isArray(block.keyPoints) ? block.keyPoints : [];
        commonMisconceptions = Array.isArray(block.commonMisconceptions) ? block.commonMisconceptions : [];
        relatedConcepts = Array.isArray(block.relatedConcepts) ? block.relatedConcepts : [];
        visualUrl = block.visualUrl || block.image || '';
    }

    if (!title && !concept && !explanation) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>🧠 Concept Explainer</strong>
                <div className="mt-1 text-muted small">No concept data available.</div>
            </div>
        );
    }

    const getDifficultyColor = () => {
        const diff = String(difficulty).toLowerCase();
        if (diff === 'beginner' || diff === 'easy') return 'success';
        if (diff === 'intermediate' || diff === 'medium') return 'warning';
        if (diff === 'advanced' || diff === 'hard') return 'danger';
        return 'info';
    };

    const getDifficultyIcon = () => {
        const diff = String(difficulty).toLowerCase();
        if (diff === 'beginner' || diff === 'easy') return '🌱';
        if (diff === 'intermediate' || diff === 'medium') return '📈';
        if (diff === 'advanced' || diff === 'hard') return '🚀';
        return '📚';
    };

    const displayText = isExpanded ? explanation : (explanation?.substring(0, 300) + (explanation?.length > 300 ? '...' : ''));

    return (
        <div className="concept-explainer card my-4 shadow-sm border-0">
            {/* Header */}
            <div className="card-header bg-primary bg-opacity-10 border-0">
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-brain text-primary fa-2x me-3"></i>
                        <div>
                            <h3 className="mb-0">{title || concept}</h3>
                            {concept && title !== concept && (
                                <div className="text-muted small mt-1">Also known as: {concept}</div>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 mt-sm-0">
                        <span className={`badge bg-${getDifficultyColor()} px-3 py-2`}>
                            {getDifficultyIcon()} {difficulty}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Visual/Image */}
                {visualUrl && (
                    <div className="concept-visual text-center mb-4">
                        <img
                            src={visualUrl}
                            alt={title || concept}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '250px' }}
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Main Explanation */}
                <div className="concept-explanation">
                    <h5 className="text-primary mb-3">
                        <i className="fas fa-info-circle me-2"></i>What is it?
                    </h5>
                    <p className="lead">{displayText}</p>
                    {explanation && explanation.length > 300 && (
                        <button
                            className="btn btn-sm btn-link text-primary p-0"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ms-1`}></i>
                        </button>
                    )}
                </div>

                {/* Analogy (toggleable) */}
                {analogy && (
                    <div className="concept-analogy mt-4 p-3 bg-warning bg-opacity-10 rounded border-start border-4 border-warning">
                        <div
                            className="d-flex justify-content-between align-items-center cursor-pointer"
                            onClick={() => setShowAnalogy(!showAnalogy)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h6 className="mb-0">
                                <i className="fas fa-lightbulb text-warning me-2"></i>
                                Analogy to help understand
                            </h6>
                            <i className={`fas fa-chevron-${showAnalogy ? 'up' : 'down'} text-warning`}></i>
                        </div>
                        {showAnalogy && (
                            <div className="mt-2">
                                <p className="mb-0">{analogy}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Example */}
                {example && (
                    <div className="concept-example mt-4 p-3 bg-success bg-opacity-10 rounded">
                        <h6 className="text-success mb-2">
                            <i className="fas fa-code me-2"></i>Example
                        </h6>
                        <p className="mb-0">{example}</p>
                    </div>
                )}

                {/* Key Points */}
                {keyPoints.length > 0 && (
                    <div className="concept-key-points mt-4">
                        <h6 className="text-primary mb-2">
                            <i className="fas fa-check-circle me-2"></i>Key Points
                        </h6>
                        <ul className="mb-0">
                            {keyPoints.map((point, idx) => (
                                <li key={idx} className="mb-1">{point}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Common Misconceptions */}
                {commonMisconceptions.length > 0 && (
                    <div className="concept-misconceptions mt-4 p-3 bg-danger bg-opacity-10 rounded">
                        <h6 className="text-danger mb-2">
                            <i className="fas fa-exclamation-triangle me-2"></i>Common Misconceptions
                        </h6>
                        <ul className="mb-0">
                            {commonMisconceptions.map((misconception, idx) => (
                                <li key={idx} className="mb-1">❌ {misconception}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Related Concepts */}
                {relatedConcepts.length > 0 && (
                    <div className="concept-related mt-4">
                        <h6 className="text-muted mb-2">
                            <i className="fas fa-link me-2"></i>Related Concepts
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                            {relatedConcepts.map((related, idx) => (
                                <span key={idx} className="badge bg-light text-dark border">
                                    {related}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with quick summary */}
            <div className="card-footer bg-transparent border-top">
                <div className="row text-center">
                    <div className="col-4">
                        <small className="text-muted">
                            <i className="fas fa-graduation-cap me-1"></i>
                            {difficulty} Level
                        </small>
                    </div>
                    <div className="col-4">
                        <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            5 min read
                        </small>
                    </div>
                    <div className="col-4">
                        <small className="text-muted">
                            <i className="fas fa-star me-1"></i>
                            Core Concept
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ConceptExplainerBlock);