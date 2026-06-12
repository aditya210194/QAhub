import React, { useState } from 'react';

const RootCauseAnalysisBlock = ({ block }) => {
    const { title, problem, causes, solutions, variant = 'fishbone' } = block;
    const [selectedCause, setSelectedCause] = useState(null);

    if (!causes || !Array.isArray(causes) || causes.length === 0) {
        return <div className="alert alert-info my-2 p-3">No root cause analysis data available.</div>;
    }

    if (variant === 'fishbone') {
        return (
            <div className="root-cause-fishbone my-4">
                {title && <h3 className="text-center mb-4">{title}</h3>}
                <div className="fishbone-diagram position-relative p-4 bg-light rounded">
                    <div className="text-center mb-3">
                        <div className="problem-statement d-inline-block p-2 bg-danger text-white rounded">
                            <strong>Problem:</strong> {problem}
                        </div>
                    </div>
                    <div className="row g-3">
                        {causes.map((category, idx) => (
                            <div key={idx} className="col-md-3">
                                <div className="fishbone-category">
                                    <div className="category-header text-center border-bottom pb-2 mb-2">
                                        <strong>{category.category}</strong>
                                    </div>
                                    <ul className="list-unstyled">
                                        {category.causes.map((cause, i) => (
                                            <li key={i} className="small mb-1">
                                                <i className="fas fa-arrow-right text-primary me-1"></i>
                                                {cause}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="root-cause-analysis my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card h-100 border-danger">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0"><i className="fas fa-question-circle me-2"></i>Problem Statement</h5>
                        </div>
                        <div className="card-body">
                            <p className="lead">{problem}</p>
                        </div>
                    </div>
                    <div className="card mt-4">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0"><i className="fas fa-tree me-2"></i>Root Causes</h5>
                        </div>
                        <div className="card-body">
                            {causes.map((cause, idx) => (
                                <div key={idx} className="cause-item mb-2">
                                    <button className="btn btn-link text-start w-100" onClick={() => setSelectedCause(selectedCause === idx ? null : idx)}>
                                        <i className={`fas fa-chevron-${selectedCause === idx ? 'down' : 'right'} me-2`}></i>
                                        {cause.title}
                                    </button>
                                    {selectedCause === idx && (
                                        <div className="p-2 ms-4 bg-light rounded">
                                            <ul className="mb-0">
                                                {cause.details?.map((detail, i) => <li key={i}>{detail}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 border-success">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0"><i className="fas fa-lightbulb me-2"></i>Solutions & Recommendations</h5>
                        </div>
                        <div className="card-body">
                            {solutions?.map((solution, idx) => (
                                <div key={idx} className="solution-item mb-3 p-2 border rounded">
                                    <div className="d-flex align-items-start">
                                        <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                        <div>
                                            <strong>{solution.title}</strong>
                                            <p className="small text-muted mb-0 mt-1">{solution.description}</p>
                                            {solution.priority && <span className={`badge bg-${solution.priority === 'High' ? 'danger' : 'warning'} mt-1`}>Priority: {solution.priority}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(RootCauseAnalysisBlock);