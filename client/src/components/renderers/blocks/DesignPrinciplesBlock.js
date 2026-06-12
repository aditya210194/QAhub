import React, { useState } from 'react';

const DesignPrinciplesBlock = ({ block }) => {
    const { title, principles, variant = 'cards', showExamples = true } = block;
    const [expanded, setExpanded] = useState(null);

    if (!principles || !Array.isArray(principles) || principles.length === 0) {
        return <div className="alert alert-info my-2 p-3">No design principles available.</div>;
    }

    if (variant === 'detailed') {
        return (
            <div className="design-principles-detailed my-4">
                {title && <h2 className="text-center mb-4">{title}</h2>}
                <div className="principles-list">
                    {principles.map((principle, idx) => (
                        <div key={idx} className="principle-item card mb-4">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">{idx + 1}. {principle.name}</h4>
                            </div>
                            <div className="card-body">
                                <p className="lead">{principle.description}</p>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <div className="bg-success bg-opacity-10 p-3 rounded">
                                            <h6><i className="fas fa-check-circle text-success me-2"></i>Best Practices</h6>
                                            <ul className="mb-0">
                                                {principle.bestPractices?.map((practice, i) => (
                                                    <li key={i}>{practice}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bg-danger bg-opacity-10 p-3 rounded">
                                            <h6><i className="fas fa-times-circle text-danger me-2"></i>Common Pitfalls</h6>
                                            <ul className="mb-0">
                                                {principle.pitfalls?.map((pitfall, i) => (
                                                    <li key={i}>{pitfall}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {showExamples && principle.example && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <h6><i className="fas fa-code me-2"></i>Example</h6>
                                        <pre className="mb-0 small overflow-auto">
                                            <code>{principle.example}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'accordion') {
        return (
            <div className="design-principles-accordion my-4">
                {title && <h3 className="mb-4">{title}</h3>}
                <div className="accordion" id="principlesAccordion">
                    {principles.map((principle, idx) => (
                        <div key={idx} className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                                    <i className="fas fa-gem me-2 text-primary"></i>
                                    {principle.name}
                                </button>
                            </h2>
                            <div id={`collapse${idx}`} className="accordion-collapse collapse" data-bs-parent="#principlesAccordion">
                                <div className="accordion-body">
                                    <p>{principle.description}</p>
                                    {principle.keyPoints && (
                                        <ul className="mt-2">
                                            {principle.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                                        </ul>
                                    )}
                                    {principle.example && (
                                        <div className="mt-2 p-2 bg-light rounded small">
                                            <strong>Example:</strong> {principle.example}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Cards variant (default)
    return (
        <div className="design-principles my-4">
            {title && <h3 className="mb-4 text-center">{title}</h3>}
            <div className="row g-4">
                {principles.map((principle, idx) => (
                    <div key={idx} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-primary">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">{principle.name}</h5>
                            </div>
                            <div className="card-body">
                                <p className="small">{principle.description}</p>
                                {principle.keyPoints && (
                                    <div className="mt-2">
                                        <small className="text-muted">Key Points:</small>
                                        <ul className="small mb-0 mt-1">
                                            {principle.keyPoints.slice(0, expanded === idx ? undefined : 2).map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                            {principle.keyPoints.length > 2 && expanded !== idx && (
                                                <li className="text-primary cursor-pointer" onClick={() => setExpanded(idx)}>+ {principle.keyPoints.length - 2} more...</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                                {expanded === idx && principle.example && (
                                    <div className="mt-2 p-2 bg-light rounded small">
                                        <strong>Example:</strong> {principle.example}
                                    </div>
                                )}
                            </div>
                            {principle.example && expanded !== idx && (
                                <div className="card-footer bg-transparent">
                                    <button className="btn btn-sm btn-link p-0" onClick={() => setExpanded(idx)}>
                                        View Example <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(DesignPrinciplesBlock);