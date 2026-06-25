import React from 'react';

const SelectionFrameworkBlock = ({ block }) => {
    const { title, criteria } = block;

    if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
        return <div className="alert alert-info my-3 p-3">No selection criteria available.</div>;
    }

    const getWeightColor = (weight) => {
        if (weight === 'High') return 'danger';
        if (weight === 'Medium-High') return 'warning';
        if (weight === 'Medium') return 'info';
        return 'success';
    };

    return (
        <div className="selection-framework-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {criteria.map((criterion, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{criterion.criterion}</h6>
                                <span className={`badge bg-${getWeightColor(criterion.weight)}`}>
                                    {criterion.weight} Priority
                                </span>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    {criterion.considerations && criterion.considerations.map((consideration, i) => (
                                        <li key={i} className="mb-2">
                                            <i className="fas fa-circle text-primary me-2" style={{ fontSize: '0.5rem' }}></i>
                                            {consideration}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-3">
                                    <div className="progress">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${criterion['importance-score']}%` }}
                                            aria-valuenow={criterion['importance-score']}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {criterion['importance-score']}% Importance
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(SelectionFrameworkBlock);