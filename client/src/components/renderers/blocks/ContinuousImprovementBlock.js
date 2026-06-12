import React, { useState } from 'react';

const ContinuousImprovementBlock = ({ block }) => {
    const { title, cycles, metrics, recommendations, variant = 'pdca' } = block;
    const [activeCycle, setActiveCycle] = useState(0);

    if (variant === 'pdca') {
        const pdcaCycles = cycles || [
            { name: 'Plan', icon: 'fa-clipboard-list', description: 'Identify opportunities and plan changes', activities: ['Define objectives', 'Analyze current state', 'Develop improvement plan', 'Set success metrics'] },
            { name: 'Do', icon: 'fa-play', description: 'Implement the planned changes on a small scale', activities: ['Execute test plan', 'Collect data', 'Document observations', 'Track metrics'] },
            { name: 'Check', icon: 'fa-chart-line', description: 'Analyze results and compare to expected outcomes', activities: ['Analyze data', 'Compare to baseline', 'Identify gaps', 'Document learnings'] },
            { name: 'Act', icon: 'fa-sync-alt', description: 'Standardize successful improvements or start new cycle', activities: ['Implement successful changes', 'Update standards', 'Share learnings', 'Plan next cycle'] }
        ];

        return (
            <div className="continuous-improvement-pdca my-4">
                {title && <h2 className="text-center mb-4">{title}</h2>}
                <div className="pdca-cycle d-flex flex-wrap justify-content-around">
                    {pdcaCycles.map((cycle, idx) => (
                        <div key={idx} className={`pdca-card text-center p-3 m-2 ${activeCycle === idx ? 'active' : ''}`} style={{ flex: '1', minWidth: '200px' }} onClick={() => setActiveCycle(idx)}>
                            <div className="pdca-icon mb-2">
                                <i className={`fas ${cycle.icon} fa-3x ${activeCycle === idx ? 'text-primary' : 'text-muted'}`}></i>
                            </div>
                            <div className="pdca-step">
                                <span className="badge bg-primary rounded-circle p-2 mb-2">{String.fromCharCode(65 + idx)}</span>
                                <h5>{cycle.name}</h5>
                                <p className="small text-muted">{cycle.description}</p>
                            </div>
                            {activeCycle === idx && (
                                <div className="pdca-details mt-3 p-2 bg-light rounded text-start">
                                    <strong>Activities:</strong>
                                    <ul className="small mb-0 mt-1">
                                        {cycle.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'metrics') {
        return (
            <div className="continuous-improvement-metrics my-4">
                {title && <h3 className="mb-4">{title}</h3>}
                <div className="row g-4">
                    {metrics?.map((metric, idx) => (
                        <div key={idx} className="col-md-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <i className={`fas ${metric.icon || 'fa-chart-line'} fa-2x text-primary mb-2`}></i>
                                    <h2 className={`mb-0 ${metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-danger' : 'text-primary'}`}>
                                        {metric.value}
                                    </h2>
                                    <p className="text-muted small mb-0">{metric.name}</p>
                                    {metric.change && (
                                        <small className={metric.change > 0 ? 'text-success' : 'text-danger'}>
                                            <i className={`fas fa-arrow-${metric.change > 0 ? 'up' : 'down'} me-1`}></i>
                                            {Math.abs(metric.change)}%
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="continuous-improvement my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0"><i className="fas fa-chart-line me-2"></i>Improvement Journey</h5>
                        </div>
                        <div className="card-body">
                            <div className="improvement-timeline">
                                {cycles?.map((cycle, idx) => (
                                    <div key={idx} className="timeline-node d-flex mb-3">
                                        <div className="timeline-marker me-3">
                                            <div className="marker-dot bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                                            {idx < cycles.length - 1 && <div className="marker-line position-absolute" style={{ width: '2px', height: '30px', backgroundColor: '#dee2e6', marginLeft: '5px' }}></div>}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6>{cycle.phase}</h6>
                                            <p className="small text-muted mb-0">{cycle.description}</p>
                                            {cycle.result && <span className="badge bg-info mt-1">{cycle.result}</span>}
                                        </div>
                                        <div className="timeline-date ms-3">
                                            <small className="text-muted">{cycle.date}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0"><i className="fas fa-lightbulb me-2"></i>Recommendations</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled">
                                {recommendations?.map((rec, idx) => (
                                    <li key={idx} className="mb-2 d-flex align-items-start">
                                        <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0"><i className="fas fa-question-circle me-2"></i>Next Steps</h5>
                        </div>
                        <div className="card-body">
                            <ol className="mb-0 small">
                                <li>Review current metrics</li>
                                <li>Identify improvement areas</li>
                                <li>Plan PDCA cycle</li>
                                <li>Implement changes</li>
                                <li>Measure and adjust</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ContinuousImprovementBlock);