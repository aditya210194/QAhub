import React from 'react';

const PhaseAnalysisBlock = ({ block }) => {
    const { title, phases, metrics } = block;

    return (
        <div className="phase-analysis my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row">
                <div className="col-lg-8">
                    <div className="phases-timeline">
                        {phases?.map((phase, idx) => (
                            <div key={idx} className="phase-card mb-3 p-3 border rounded">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <h5 className="mb-1">{phase.name}</h5>
                                    <span className={`badge bg-${phase.status === 'completed' ? 'success' : phase.status === 'in-progress' ? 'warning' : 'secondary'}`}>
                                        {phase.status}
                                    </span>
                                </div>
                                <p className="text-muted small">{phase.description}</p>
                                <div className="phase-stats d-flex gap-3 mt-2">
                                    {phase.duration && <small><i className="fas fa-clock me-1"></i>{phase.duration}</small>}
                                    {phase.effort && <small><i className="fas fa-chart-line me-1"></i>Effort: {phase.effort}%</small>}
                                    {phase.risk && <small className="text-danger"><i className="fas fa-exclamation-triangle me-1"></i>Risk: {phase.risk}</small>}
                                </div>
                                {phase.activities && (
                                    <div className="mt-2">
                                        <small className="text-muted">Key Activities:</small>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {phase.activities.map((act, i) => <span key={i} className="badge bg-light text-dark border">{act}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {metrics && (
                    <div className="col-lg-4">
                        <div className="phase-metrics card">
                            <div className="card-header bg-primary text-white">
                                <h6 className="mb-0">Phase Metrics</h6>
                            </div>
                            <div className="card-body">
                                {metrics.map((metric, idx) => (
                                    <div key={idx} className="metric-item mb-3">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span>{metric.name}</span>
                                            <span className="fw-bold">{metric.value}</span>
                                        </div>
                                        <div className="progress" style={{ height: '4px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${metric.percentage}%` }}></div>
                                        </div>
                                        <small className="text-muted">{metric.description}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(PhaseAnalysisBlock);