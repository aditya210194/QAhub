// src/components/renderers/blocks/StepByStepBlock.js
import React, { useState } from 'react';

const StepByStepBlock = ({ block, index }) => {
    const [completedSteps, setCompletedSteps] = useState({});
    const { title, steps, interactive = false, variant = 'numbered' } = block;

    const toggleStep = (stepIndex) => {
        if (interactive) {
            setCompletedSteps(prev => ({
                ...prev,
                [stepIndex]: !prev[stepIndex]
            }));
        }
    };

    const getStepIcon = (stepIndex, step) => {
        if (interactive && completedSteps[stepIndex]) {
            return <i className="fas fa-check-circle text-success"></i>;
        }
        if (step.icon) {
            return <i className={`${step.icon} text-primary`}></i>;
        }
        if (variant === 'numbered') {
            return <span className="step-number">{stepIndex + 1}</span>;
        }
        if (variant === 'bullets') {
            return <i className="fas fa-circle text-primary fa-xs"></i>;
        }
        return <i className="fas fa-arrow-right text-primary"></i>;
    };

    return (
        <div className="step-by-step-block my-4">
            {title && <h4 className="mb-3">{title}</h4>}
            <div className="steps-container">
                {steps?.map((step, idx) => (
                    <div
                        key={idx}
                        className={`step-item d-flex mb-3 ${interactive ? 'cursor-pointer' : ''}`}
                        onClick={() => interactive && toggleStep(idx)}
                    >
                        <div className="step-icon me-3 flex-shrink-0">
                            {getStepIcon(idx, step)}
                        </div>
                        <div className="step-content flex-grow-1">
                            <div className={`step-title fw-bold ${interactive && completedSteps[idx] ? 'text-decoration-line-through text-muted' : ''}`}>
                                {step.title || step.step}
                            </div>
                            {step.description && (
                                <div className="step-description text-muted small mt-1">
                                    {step.description}
                                </div>
                            )}
                            {step.tip && (
                                <div className="step-tip mt-1 small text-info">
                                    <i className="fas fa-lightbulb me-1"></i> Tip: {step.tip}
                                </div>
                            )}
                            {step.code && (
                                <pre className="step-code mt-2 p-2 bg-dark text-light rounded small overflow-auto">
                                    <code>{step.code}</code>
                                </pre>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {interactive && (
                <div className="step-progress mt-3 text-center">
                    <div className="progress" style={{ height: '6px' }}>
                        <div
                            className="progress-bar bg-success"
                            style={{ width: `${(Object.values(completedSteps).filter(Boolean).length / steps.length) * 100}%` }}
                        ></div>
                    </div>
                    <small className="text-muted">
                        {Object.values(completedSteps).filter(Boolean).length} of {steps.length} steps completed
                    </small>
                </div>
            )}
        </div>
    );
};

export default React.memo(StepByStepBlock);