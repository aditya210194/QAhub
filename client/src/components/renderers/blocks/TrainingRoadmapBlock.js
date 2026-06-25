import React, { useState } from 'react';

const TrainingRoadmapBlock = ({ block }) => {
    const { title, roadmap } = block;
    const [expandedPhase, setExpandedPhase] = useState(null);

    if (!roadmap || !Array.isArray(roadmap) || roadmap.length === 0) {
        return <div className="alert alert-info my-3 p-3">No training roadmap available.</div>;
    }

    return (
        <div className="training-roadmap-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="timeline">
                {roadmap.map((phase, idx) => (
                    <div key={idx} className="timeline-item mb-4">
                        <div className="d-flex align-items-start">
                            <div className="timeline-marker me-3">
                                <div className="rounded-circle bg-primary p-2 text-white text-center" style={{ width: '40px', height: '40px' }}>
                                    <small>{idx + 1}</small>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <div
                                    className="card shadow-sm cursor-pointer"
                                    onClick={() => setExpandedPhase(expandedPhase === idx ? null : idx)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">{phase.phase}</h6>
                                        <span className="badge bg-secondary">{phase.duration}</span>
                                    </div>
                                    <div className="card-body">
                                        <p className="small">{phase.objectives}</p>

                                        {expandedPhase === idx && (
                                            <div className="mt-3">
                                                {phase.activities && (
                                                    <div className="mb-3">
                                                        <strong className="small">Activities:</strong>
                                                        <ul className="small list-unstyled mt-1">
                                                            {phase.activities.map((activity, i) => (
                                                                <li key={i} className="mb-1">
                                                                    <i className="fas fa-tasks text-primary me-1"></i>
                                                                    {activity}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {phase.outcomes && (
                                                    <div>
                                                        <strong className="small">Outcomes:</strong>
                                                        <ul className="small list-unstyled mt-1">
                                                            {phase.outcomes.map((outcome, i) => (
                                                                <li key={i} className="mb-1">
                                                                    <i className="fas fa-check-circle text-success me-1"></i>
                                                                    {outcome}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <small className="text-muted">
                                            {expandedPhase === idx ? 'Click to collapse' : 'Click to expand details'}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .timeline-item:not(:last-child) .timeline-marker::after {
                    content: '';
                    position: absolute;
                    top: 40px;
                    left: 50%;
                    height: calc(100% + 16px);
                    width: 2px;
                    background-color: #dee2e6;
                }
                .timeline-item {
                    position: relative;
                }
                .timeline-marker {
                    position: relative;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    );
};

export default React.memo(TrainingRoadmapBlock);