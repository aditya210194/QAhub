import React, { useState } from 'react';

const ImplementationPhasesBlock = ({ block }) => {
    const { title, phases, showProgress = true } = block;
    const [completedPhases, setCompletedPhases] = useState({});

    if (!phases || !Array.isArray(phases) || phases.length === 0) {
        return <div className="alert alert-info my-2 p-3">No implementation phases available.</div>;
    }

    const togglePhase = (index) => {
        setCompletedPhases(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const completedCount = Object.values(completedPhases).filter(Boolean).length;
    const progressPercent = (completedCount / phases.length) * 100;

    return (
        <div className="implementation-phases my-4">
            {title && <h3 className="mb-3">{title}</h3>}
            {showProgress && (
                <div className="mb-4">
                    <div className="d-flex justify-content-between small mb-1">
                        <span>Overall Progress</span>
                        <span>{completedCount}/{phases.length} phases completed</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                        <div className="progress-bar bg-primary" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            )}
            <div className="phases-timeline">
                {phases.map((phase, idx) => (
                    <div key={idx} className={`phase-item mb-3 p-3 border rounded ${completedPhases[idx] ? 'bg-success bg-opacity-10' : ''}`}>
                        <div className="d-flex align-items-start">
                            <div className="phase-number me-3">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${completedPhases[idx] ? 'bg-success text-white' : 'bg-secondary text-white'}`} style={{ width: '32px', height: '32px' }}>
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <h5 className="mb-1">{phase.name}</h5>
                                    {phase.duration && <span className="badge bg-info"><i className="fas fa-clock me-1"></i>{phase.duration}</span>}
                                </div>
                                <p className="text-muted small mb-2">{phase.description}</p>
                                {phase.activities && (
                                    <ul className="mb-0 small">
                                        {phase.activities.map((activity, i) => (
                                            <li key={i}>{activity}</li>
                                        ))}
                                    </ul>
                                )}
                                {phase.deliverables && (
                                    <div className="mt-2">
                                        <strong>Deliverables:</strong>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {phase.deliverables.map((del, i) => (
                                                <span key={i} className="badge bg-light text-dark border">{del}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {showProgress && (
                                <div className="phase-check ms-2">
                                    <button className={`btn btn-sm ${completedPhases[idx] ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => togglePhase(idx)}>
                                        <i className={`fas ${completedPhases[idx] ? 'fa-check-circle' : 'fa-circle'}`}></i>
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

export default React.memo(ImplementationPhasesBlock);