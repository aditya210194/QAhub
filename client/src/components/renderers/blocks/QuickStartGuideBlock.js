import React, { useState } from 'react';

const QuickStartGuideBlock = ({ block }) => {
    const { steps } = block;
    const [expandedStep, setExpandedStep] = useState(null);

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
        return <div className="alert alert-info my-3 p-3">No quick start guide available.</div>;
    }

    return (
        <div className="quick-start-guide-block my-4">
            <div className="row">
                <div className="col-lg-3">
                    <div className="position-sticky" style={{ top: '2rem' }}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6>Quick Start Steps</h6>
                                <div className="list-group list-group-flush">
                                    {steps.map((step, idx) => (
                                        <button
                                            key={idx}
                                            className={`list-group-item list-group-item-action ${expandedStep === idx ? 'active' : ''}`}
                                            onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                                        >
                                            <span className="badge bg-primary rounded-pill me-2">{idx + 1}</span>
                                            {step.step}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-9">
                    {steps.map((step, idx) => (
                        <div key={idx} className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">
                                    <span className="badge bg-light text-primary me-2">{idx + 1}</span>
                                    {step.step}
                                    <span className="badge bg-light text-primary ms-2">{step.duration}</span>
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Activities</h6>
                                        <ul className="list-unstyled">
                                            {step.activities && step.activities.map((activity, i) => (
                                                <li key={i} className="mb-2">
                                                    <i className="fas fa-check-circle text-success me-2"></i>
                                                    {activity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-info">Resources</h6>
                                        <ul className="list-unstyled">
                                            {step.resources && step.resources.map((resource, i) => (
                                                <li key={i} className="mb-2">
                                                    <i className="fas fa-book text-info me-2"></i>
                                                    {resource}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-3 p-3 bg-light rounded">
                                    <h6 className="text-success">Outcome</h6>
                                    <p className="mb-0">{step.outcome}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(QuickStartGuideBlock);