// src/components/renderers/blocks/ProcessStepsBlock.js
import React, { useState } from 'react';

const ProcessStepsBlock = ({ block, index }) => {
    const [activeStep, setActiveStep] = useState(null);
    const [completedSteps, setCompletedSteps] = useState({});

    // Safely extract values
    let title = block?.title || '';
    let steps = block?.steps || [];
    let summary = block?.summary || '';
    let variant = block?.variant || 'numbered';
    let interactive = block?.interactive || false;

    if (!steps || steps.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>⚙️ Process Steps</strong>
                <div className="mt-1 text-muted small">No steps available.</div>
            </div>
        );
    }

    // Parse step strings into title and description
    const parseStep = (step, idx) => {
        if (typeof step === 'string') {
            // Split at the first colon or period followed by space
            const colonIndex = step.indexOf(':');
            const periodIndex = step.indexOf('. ');

            let title = '';
            let description = step;

            if (colonIndex > 0 && colonIndex < 100) {
                title = step.substring(0, colonIndex).trim();
                description = step.substring(colonIndex + 1).trim();
            } else if (periodIndex > 0 && periodIndex < 100) {
                title = step.substring(0, periodIndex).trim();
                description = step.substring(periodIndex + 2).trim();
            } else {
                // If no clear separator, use first 60 chars as title
                title = step.length > 60 ? step.substring(0, 60) + '...' : step;
                description = step;
            }

            return { title, description, original: step };
        }
        return step;
    };

    const parsedSteps = steps.map((step, idx) => parseStep(step, idx));

    const toggleStep = (stepIndex) => {
        if (interactive) {
            setCompletedSteps(prev => ({
                ...prev,
                [stepIndex]: !prev[stepIndex]
            }));
        }
    };

    const toggleExpand = (stepIndex) => {
        setActiveStep(prev => prev === stepIndex ? null : stepIndex);
    };

    const getStepIcon = (step, idx) => {
        if (variant === 'numbered') {
            return (
                <div className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '36px', height: '36px', fontSize: '16px', fontWeight: 'bold', flexShrink: 0 }}>
                    {idx + 1}
                </div>
            );
        }
        if (variant === 'checklist' && interactive) {
            return (
                <div className="step-checkbox" style={{ flexShrink: 0 }}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={completedSteps[idx] || false}
                        onChange={() => toggleStep(idx)}
                        style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            );
        }
        return (
            <div className="step-icon-circle bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                 style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                <i className="fas fa-check text-primary"></i>
            </div>
        );
    };

    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

    // Horizontal variant
    if (variant === 'horizontal') {
        return (
            <div className="process-steps-horizontal my-4">
                {title && <h3 className="mb-4 text-center">{title}</h3>}
                <div className="d-flex justify-content-between flex-wrap">
                    {parsedSteps.map((step, idx) => (
                        <div key={idx} className="text-center p-3 flex-grow-1" style={{ minWidth: '150px' }}>
                            <div className="step-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                 style={{ width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold' }}>
                                {idx + 1}
                            </div>
                            <strong>{step.title}</strong>
                            <p className="small text-muted mt-1">{step.description.substring(0, 80)}...</p>
                        </div>
                    ))}
                </div>
                {summary && <div className="mt-4 p-3 bg-light rounded text-center">{summary}</div>}
            </div>
        );
    }

    // Default numbered variant
    return (
        <div className="process-steps my-4">
            {title && <h3 className="mb-4">{title}</h3>}

            {interactive && variant === 'checklist' && (
                <div className="steps-progress mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Progress</span>
                        <span className="text-primary">{completedCount}/{steps.length} completed</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                        <div className="progress-bar bg-primary" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            )}

            <div className="steps-container">
                {parsedSteps.map((step, idx) => {
                    const isExpanded = activeStep === idx;
                    const isCompleted = completedSteps[idx] || false;

                    return (
                        <div
                            key={idx}
                            className={`step-item d-flex mb-3 p-3 rounded ${interactive ? 'cursor-pointer' : ''} ${isCompleted ? 'bg-success bg-opacity-10' : 'bg-light'}`}
                            onClick={() => interactive && variant !== 'checklist' && toggleExpand(idx)}
                        >
                            <div className="step-icon me-3">
                                {getStepIcon(step, idx)}
                            </div>
                            <div className="step-content flex-grow-1">
                                <div className={`step-title fw-bold ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                                    {step.title}
                                </div>
                                <div className={`step-description text-muted small mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                    {step.description}
                                </div>

                                {step.description && step.description.length > 200 && (
                                    <button
                                        className="btn btn-sm btn-link text-primary p-0 mt-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(idx);
                                        }}
                                    >
                                        {isExpanded ? 'Show less' : 'Read more'}
                                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ms-1`}></i>
                                    </button>
                                )}
                            </div>
                            {variant === 'checklist' && interactive && (
                                <div className="step-status ms-2">
                                    {isCompleted && <i className="fas fa-check-circle text-success fa-lg"></i>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {summary && (
                <div className="process-summary mt-4 p-3 bg-primary bg-opacity-10 rounded">
                    <strong><i className="fas fa-clipboard-list me-2"></i>Summary:</strong>
                    <p className="mb-0 mt-1">{summary}</p>
                </div>
            )}

            {interactive && variant === 'checklist' && completedCount === steps.length && (
                <div className="checklist-complete mt-3 p-3 bg-success bg-opacity-10 rounded text-center">
                    <i className="fas fa-trophy text-success fa-2x mb-2"></i>
                    <h6 className="mb-0">Excellent! You've mastered this methodology.</h6>
                </div>
            )}
        </div>
    );
};

export default React.memo(ProcessStepsBlock);