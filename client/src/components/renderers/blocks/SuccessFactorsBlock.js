import React from 'react';

const SuccessFactorsBlock = ({ block }) => {
    const { title, factors } = block;

    if (!factors || !Array.isArray(factors) || factors.length === 0) {
        return <div className="alert alert-info my-3 p-3">No success factors available.</div>;
    }

    return (
        <div className="success-factors-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {factors.map((factor, idx) => (
                    <div key={idx} className="col-md-4">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    <div className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-block">
                                        <i className={`fas fa-${factor.icon || 'check-circle'} text-success`} style={{ fontSize: '2rem' }}></i>
                                    </div>
                                </div>
                                <h6>{factor.factor}</h6>
                                <p className="small text-muted">{factor.description}</p>

                                {factor['key-metrics'] && (
                                    <div className="mt-3">
                                        <strong className="small">Key Metrics:</strong>
                                        <ul className="small list-unstyled mt-1 text-start">
                                            {factor['key-metrics'].map((metric, i) => (
                                                <li key={i} className="mb-1">
                                                    <i className="fas fa-chart-simple text-info me-1"></i>
                                                    {metric}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(SuccessFactorsBlock);