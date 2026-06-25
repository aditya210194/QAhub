import React, { useState } from 'react';

const RiskMitigationBlock = ({ block }) => {
    const { title, risks } = block;
    const [selectedRisk, setSelectedRisk] = useState(null);

    if (!risks || !Array.isArray(risks) || risks.length === 0) {
        return <div className="alert alert-info my-3 p-3">No risk mitigation data available.</div>;
    }

    const getProbabilityColor = (probability) => {
        if (probability === 'High') return 'danger';
        if (probability === 'Medium') return 'warning';
        return 'success';
    };

    const getImpactColor = (impact) => {
        if (impact === 'High') return 'danger';
        if (impact === 'Medium') return 'warning';
        return 'success';
    };

    return (
        <div className="risk-mitigation-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {risks.map((risk, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">{risk.risk}</h6>
                                    <div className="d-flex gap-2">
                                        <span className={`badge bg-${getProbabilityColor(risk.probability)}`}>
                                            P: {risk.probability}
                                        </span>
                                        <span className={`badge bg-${getImpactColor(risk.impact)}`}>
                                            I: {risk.impact}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {selectedRisk === idx && (
                                    <div>
                                        <div className="mb-3">
                                            <strong className="small">Mitigation Strategies:</strong>
                                            <ul className="small list-unstyled mt-1">
                                                {risk.mitigation && risk.mitigation.map((strategy, i) => (
                                                    <li key={i} className="mb-2 p-2 bg-light rounded">
                                                        <i className="fas fa-shield text-primary me-2"></i>
                                                        {strategy}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <span className="badge bg-secondary">
                                                    Risk Score: {risk['risk-score']}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="badge bg-info">
                                                    Priority: {risk.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setSelectedRisk(selectedRisk === idx ? null : idx)}
                                >
                                    {selectedRisk === idx ? 'Hide Mitigation' : 'Show Mitigation'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(RiskMitigationBlock);