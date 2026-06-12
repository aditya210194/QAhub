import React, { useState } from 'react';

const AnalogyBlock = ({ block, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        let textToCopy = `${block.title}\n\n${block.content}`;
        if (block.explanation) textToCopy += `\n\nExplanation: ${block.explanation}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getAnalogyType = () => {
        const typeMap = {
            'real-world': { icon: 'fas fa-globe-americas', color: 'success' },
            'technical': { icon: 'fas fa-cogs', color: 'info' },
            'metaphor': { icon: 'fas fa-theater-masks', color: 'warning' },
            'story': { icon: 'fas fa-book-open', color: 'primary' },
            'comparison': { icon: 'fas fa-balance-scale', color: 'secondary' }
        };
        return typeMap[block.analogyType] || { icon: 'fas fa-lightbulb', color: 'primary' };
    };

    const analogyType = getAnalogyType();

    return (
        <div className="analogy-block card my-4">
            <div className={`card-header bg-${analogyType.color} bg-opacity-10 border-${analogyType.color}`}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <i className={`${analogyType.icon} text-${analogyType.color} me-2`}></i>
                        <h5 className="card-title mb-0 text-dark">{block.title || 'Analogy'}</h5>
                    </div>
                    <div className="analogy-actions">
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={handleCopy}>
                            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                            {copied ? ' Copied!' : ' Copy'}
                        </button>
                        {(block.explanation || block.components) && (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setExpanded(!expanded)}>
                                <i> className={`fas fa-${expanded ? 'minus' : 'plus'}`}</i>
                        {expanded ? ' Less' : ' More'}
                            </button>
                            )}
                    </div>
                </div>
                {(block.difficulty || block.domain) && (
                    <div className="analogy-meta mt-2 small">
                        {block.difficulty && <span className="me-3"><i className="fas fa-brain me-1"></i>Level: <span className={`badge ${block.difficulty === 'easy' ? 'bg-success' : block.difficulty === 'medium' ? 'bg-warning' : 'bg-danger'}`}>{block.difficulty}</span></span>}
                        {block.domain && <span className="me-3"><i className="fas fa-tag me-1"></i>Domain: {block.domain}</span>}
                    </div>
                )}
            </div>
            <div className="card-body">
                <div className="analogy-content">
                    <div className="analogy-main d-flex align-items-start">
                        <div className="analogy-icon me-3"><i className="fas fa-arrow-right text-muted fa-lg mt-1"></i></div>
                        <div className="analogy-text flex-grow-1">
                            <div className="analogy-statement lead">{block.content}</div>
                            {block.visual && (
                                <div className="analogy-visual mt-3 text-center">
                                    <div className="visual-container p-3 bg-light rounded">
                                        <i className={`${block.visual.icon} fa-2x text-${analogyType.color} mb-2`}></i>
                                        <div className="visual-text small">{block.visual.text}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {block.mapping && (
                        <div className="analogy-mapping mt-3 p-3 bg-light rounded">
                            <h6 className="mb-3 text-center"><i className="fas fa-project-diagram me-2"></i>How This Maps to Your Context</h6>
                            <div className="row text-center">
                                {block.mapping.map((map, i) => (
                                    <div key={i} className="col-md-6 mb-2">
                                        <div className="mapping-item"><strong className="d-block text-primary">{map.from}</strong><i className="fas fa-arrow-down text-muted my-1"></i><div className="text-success">{map.to}</div></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {expanded && (
                    <div className="expanded-content mt-4">
                        {block.explanation && (
                            <div className="analogy-explanation mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-info-circle me-2 text-info"></i>Why This Analogy Works</h6>
                                <div className="explanation-content mt-2">{block.explanation}</div>
                            </div>
                        )}
                        {block.components && (
                            <div className="analogy-components mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-puzzle-piece me-2 text-warning"></i>Analogy Components</h6>
                                {block.components.map((component, i) => (
                                    <div key={i} className="component-item card mb-2"><div className="card-body py-2"><div className="d-flex justify-content-between align-items-center"><div><strong>{component.concept}:</strong> <span className="text-muted ms-2">→</span> <span className="ms-2">{component.analog}</span></div><small className="text-muted">{component.role}</small></div></div></div>
                                ))}
                            </div>
                        )}
                        {block.learningTips && (
                            <div className="learning-tips mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-graduation-cap me-2 text-success"></i>Learning Tips</h6>
                                {block.learningTips.map((tip, i) => <div key={i} className="tip-item d-flex align-items-start mb-2"><i className="fas fa-check-circle text-success me-2 mt-1"></i><span>{tip}</span></div>)}
                            </div>
                        )}
                    </div>
                )}
                <div className="analogy-footer mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="analogy-tags">{block.tags?.map((tag, i) => <span key={i} className="badge bg-light text-dark border me-1">{tag}</span>)}</div>
                        <div className="quick-feedback"><small className="text-muted"><i className="fas fa-comment me-1"></i>Did this analogy help? <button className="btn btn-sm btn-link p-0 ms-1" title="Helpful"><i className="fas fa-thumbs-up text-success"></i></button><button className="btn btn-sm btn-link p-0 ms-1" title="Not helpful"><i className="fas fa-thumbs-down text-danger"></i></button></small></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AnalogyBlock);