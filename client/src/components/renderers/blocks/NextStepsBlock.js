import React, { useState } from 'react';

const NextStepsBlock = ({ block }) => {
    const { title, actions } = block;
    const [selectedAction, setSelectedAction] = useState(null);

    if (!actions || !Array.isArray(actions) || actions.length === 0) {
        return <div className="alert alert-info my-3 p-3">No next steps available.</div>;
    }

    const getEffortColor = (effort) => {
        if (effort === 'High') return 'danger';
        if (effort === 'Medium') return 'warning';
        return 'success';
    };

    return (
        <div className="next-steps-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {actions.map((action, idx) => (
                    <div key={idx} className="col-md-6 col-lg-3">
                        <div
                            className="card h-100 shadow-sm cursor-pointer"
                            onMouseEnter={() => setSelectedAction(idx)}
                            onMouseLeave={() => setSelectedAction(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{action.action}</h6>
                                <span className={`badge bg-${getEffortColor(action.effort)}`}>
                                    {action.effort}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <span className="badge bg-secondary">
                                        <i className="fas fa-clock me-1"></i>
                                        {action.duration}
                                    </span>
                                </div>

                                {selectedAction === idx && (
                                    <div className="mt-3">
                                        <div className="mb-2">
                                            <strong className="small">Resources:</strong>
                                            <p className="small text-muted mb-0">{action.resources}</p>
                                        </div>
                                        <div className="p-2 bg-light rounded">
                                            <strong className="small">Outcome:</strong>
                                            <p className="small text-success mb-0">{action.outcome}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <small className="text-muted">
                                    {selectedAction === idx ? 'Showing details...' : 'Hover for details'}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(NextStepsBlock);