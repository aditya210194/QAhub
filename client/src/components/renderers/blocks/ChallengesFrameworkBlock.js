import React, { useState } from 'react';

const ChallengesFrameworkBlock = ({ block }) => {
    const { title, challenges } = block;
    const [expandedChallenge, setExpandedChallenge] = useState(null);

    if (!challenges || !Array.isArray(challenges) || challenges.length === 0) {
        return <div className="alert alert-info my-3 p-3">No challenges available.</div>;
    }

    const getSeverityColor = (severity) => {
        if (severity === 'Critical') return 'danger';
        if (severity === 'High') return 'warning';
        if (severity === 'Medium') return 'info';
        return 'success';
    };

    return (
        <div className="challenges-framework-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {challenges.map((challenge, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{challenge.challenge}</h6>
                                <span className={`badge bg-${getSeverityColor(challenge.severity)}`}>
                                    {challenge.severity}
                                </span>
                            </div>
                            <div className="card-body">
                                <p className="small text-muted">{challenge.description}</p>

                                <div className="mb-2">
                                    <span className="badge bg-secondary">Frequency: {challenge.frequency}</span>
                                </div>

                                {expandedChallenge === idx && (
                                    <>
                                        {challenge['solutions'] && (
                                            <div className="mt-3">
                                                <strong className="small">Solutions:</strong>
                                                <ul className="small list-unstyled mt-1">
                                                    {challenge['solutions'].map((solution, i) => (
                                                        <li key={i} className="mb-1">
                                                            <i className="fas fa-check-circle text-success me-1"></i>
                                                            {solution}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {challenge['impact'] && (
                                            <div className="mt-2">
                                                <strong className="small">Impact:</strong>
                                                <p className="small text-danger mb-0">{challenge['impact']}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button
                                    className="btn btn-sm btn-link"
                                    onClick={() => setExpandedChallenge(expandedChallenge === idx ? null : idx)}
                                >
                                    {expandedChallenge === idx ? 'Show less' : 'Show solutions'}
                                    <i className={`fas fa-chevron-${expandedChallenge === idx ? 'up' : 'down'} ms-1`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(ChallengesFrameworkBlock);