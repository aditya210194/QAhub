import React, { useState } from 'react';

const StrategyBlock = ({ block }) => {
    const { title, strategies, variant = 'cards' } = block;
    const [expanded, setExpanded] = useState(null);

    if (!strategies || !Array.isArray(strategies) || strategies.length === 0) {
        return <div className="alert alert-info my-2 p-3">No strategy data available.</div>;
    }

    if (variant === 'timeline') {
        return (
            <div className="strategy-timeline my-4">
                {title && <h3 className="mb-4">{title}</h3>}
                <div className="timeline">
                    {strategies.map((strategy, idx) => (
                        <div key={idx} className="timeline-item d-flex mb-4">
                            <div className="timeline-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                {idx + 1}
                            </div>
                            <div className="timeline-content ms-3 p-3 bg-light rounded flex-grow-1">
                                <h5>{strategy.title}</h5>
                                <p>{strategy.description}</p>
                                {strategy.steps && (
                                    <ul className="mb-0">
                                        {strategy.steps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="strategy-cards my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                {strategies.map((strategy, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header bg-success bg-opacity-10">
                                <h5 className="mb-0">{strategy.title}</h5>
                            </div>
                            <div className="card-body">
                                <p>{strategy.description}</p>
                                {strategy.steps && expanded === idx && (
                                    <div className="mt-2">
                                        <strong>Implementation Steps:</strong>
                                        <ol className="mt-1">
                                            {strategy.steps.map((step, i) => <li key={i}>{step}</li>)}
                                        </ol>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button className="btn btn-sm btn-link" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                                    {expanded === idx ? 'Show less' : 'Show steps'}
                                    <i className={`fas fa-chevron-${expanded === idx ? 'up' : 'down'} ms-1`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(StrategyBlock);