import React, { useState } from 'react';

const PreparationStrategyBlock = ({ block }) => {
    const { title, actions } = block;
    const [expandedAction, setExpandedAction] = useState(null);

    if (!actions || !Array.isArray(actions) || actions.length === 0) {
        return <div className="alert alert-info my-3 p-3">No preparation strategies available.</div>;
    }

    const getPriorityColor = (priority) => {
        if (priority === 'High') return 'danger';
        if (priority === 'Medium-High') return 'warning';
        if (priority === 'Medium') return 'info';
        return 'success';
    };

    const getTimelineColor = (timeline) => {
        if (timeline.includes('Immediate')) return 'danger';
        if (timeline.includes('months')) return 'warning';
        return 'info';
    };

    return (
        <div className="preparation-strategy-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {actions.map((action, idx) => (
                    <div key={idx} className="col-lg-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{action.action}</h6>
                                <span className={`badge bg-${getPriorityColor(action.priority)}`}>
                                    {action.priority} Priority
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <span className={`badge bg-${getTimelineColor(action.timeline)} me-2`}>
                                        <i className="fas fa-clock me-1"></i>
                                        {action.timeline}
                                    </span>
                                    <span className="badge bg-secondary">
                                        Effort: {action.effort}
                                    </span>
                                </div>

                                {expandedAction === idx && (
                                    <>
                                        <div className="mb-3">
                                            <strong className="small">Activities:</strong>
                                            <ul className="small list-unstyled mt-1">
                                                {action.activities && action.activities.map((activity, i) => (
                                                    <li key={i} className="mb-1">
                                                        <i className="fas fa-tasks text-primary me-1"></i>
                                                        {activity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {action.resources && (
                                            <div>
                                                <strong className="small">Resources:</strong>
                                                <ul className="small list-unstyled mt-1">
                                                    {action.resources.map((resource, i) => (
                                                        <li key={i} className="mb-1">
                                                            <i className="fas fa-users text-info me-1"></i>
                                                            {resource}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {action.outcome && (
                                            <div className="mt-3 p-2 bg-success bg-opacity-10 rounded">
                                                <i className="fas fa-bullseye text-success me-2"></i>
                                                <small>{action.outcome}</small>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button
                                    className="btn btn-sm btn-link"
                                    onClick={() => setExpandedAction(expandedAction === idx ? null : idx)}
                                >
                                    {expandedAction === idx ? 'Show less' : 'Show details'}
                                    <i className={`fas fa-chevron-${expandedAction === idx ? 'up' : 'down'} ms-1`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(PreparationStrategyBlock);