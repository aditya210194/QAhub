import React, { useState } from 'react';

const ImplementationRoadmapBlock = ({ block }) => {
    const { title, phases, showProgress = true, interactive = false } = block;
    const [completedItems, setCompletedItems] = useState({});

    if (!phases || !Array.isArray(phases) || phases.length === 0) {
        return <div className="alert alert-info my-2 p-3">No implementation roadmap available.</div>;
    }

    const toggleItem = (phaseIdx, itemIdx) => {
        if (!interactive) return;
        const key = `${phaseIdx}-${itemIdx}`;
        setCompletedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getPhaseProgress = (phaseIdx, items) => {
        if (!items) return 0;
        let completed = 0;
        items.forEach((_, itemIdx) => {
            if (completedItems[`${phaseIdx}-${itemIdx}`]) completed++;
        });
        return items.length > 0 ? (completed / items.length) * 100 : 0;
    };

    return (
        <div className="implementation-roadmap my-4">
            {title && <h2 className="text-center mb-4">{title}</h2>}
            <div className="roadmap-timeline position-relative">
                {phases.map((phase, phaseIdx) => {
                    const phaseProgress = getPhaseProgress(phaseIdx, phase.items);
                    return (
                        <div key={phaseIdx} className="roadmap-phase mb-4">
                            <div className="phase-header d-flex align-items-center mb-3">
                                <div className="phase-marker bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                    {phaseIdx + 1}
                                </div>
                                <div className="flex-grow-1">
                                    <h4 className="mb-1">{phase.name}</h4>
                                    {phase.duration && <small className="text-muted"><i className="fas fa-clock me-1"></i>{phase.duration}</small>}
                                </div>
                                {showProgress && (
                                    <div className="phase-progress ms-3 text-end" style={{ width: '100px' }}>
                                        <small className="text-muted">{Math.round(phaseProgress)}%</small>
                                        <div className="progress mt-1" style={{ height: '4px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${phaseProgress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="phase-content ms-5 ps-3">
                                <p className="text-muted small mb-3">{phase.description}</p>
                                {phase.items && (
                                    <ul className="roadmap-items list-unstyled">
                                        {phase.items.map((item, itemIdx) => {
                                            const isCompleted = completedItems[`${phaseIdx}-${itemIdx}`];
                                            return (
                                                <li key={itemIdx} className={`roadmap-item d-flex align-items-start mb-2 p-2 rounded ${interactive ? 'cursor-pointer' : ''} ${isCompleted ? 'bg-success bg-opacity-10' : ''}`} onClick={() => toggleItem(phaseIdx, itemIdx)}>
                                                    {interactive && (
                                                        <div className="item-check me-3">
                                                            <i className={`fas ${isCompleted ? 'fa-check-circle text-success' : 'fa-circle text-muted'}`}></i>
                                                        </div>
                                                    )}
                                                    <div className="flex-grow-1">
                                                        <div className={`fw-bold ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>{item.title}</div>
                                                        {item.description && <div className="small text-muted">{item.description}</div>}
                                                    </div>
                                                    {item.estimation && <div className="item-estimation ms-2"><span className="badge bg-secondary">{item.estimation}</span></div>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                                {phase.deliverables && (
                                    <div className="phase-deliverables mt-2">
                                        <small className="text-muted">Deliverables:</small>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {phase.deliverables.map((del, i) => <span key={i} className="badge bg-light text-dark border">{del}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {phaseIdx < phases.length - 1 && (
                                <div className="roadmap-connector position-relative ms-5 ps-3 my-2">
                                    <div className="connector-line position-absolute start-0" style={{ width: '2px', height: '30px', backgroundColor: '#dee2e6', left: '-19px' }}></div>
                                    <i className="fas fa-arrow-down text-muted ms-2"></i>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {interactive && (
                <div className="roadmap-progress mt-4 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1 me-3">
                            <div className="progress" style={{ height: '8px' }}>
                                <div className="progress-bar bg-primary" style={{ width: `${(Object.values(completedItems).filter(Boolean).length / Object.values(completedItems).length) * 100}%` }}></div>
                            </div>
                        </div>
                        <span className="fw-bold">{Object.values(completedItems).filter(Boolean).length}/{Object.values(completedItems).length} completed</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ImplementationRoadmapBlock);