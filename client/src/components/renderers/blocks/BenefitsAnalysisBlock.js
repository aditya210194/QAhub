import React from 'react';

const BenefitsAnalysisBlock = ({ block }) => {
    const { title, benefits } = block;

    if (!benefits || !Array.isArray(benefits) || benefits.length === 0) {
        return <div className="alert alert-info my-3 p-3">No benefits available.</div>;
    }

    const getImpactColor = (impact) => {
        if (impact === 'High') return 'danger';
        if (impact === 'Medium') return 'warning';
        return 'success';
    };

    return (
        <div className="benefits-analysis-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}
            <div className="row g-4">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="rounded-circle bg-success bg-opacity-10 p-3">
                                            <i className="fas fa-chart-line text-success"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="mb-1">{benefit.benefit}</h6>
                                        <p className="text-muted small mb-2">{benefit.description}</p>
                                        <div className="d-flex gap-2">
                                            <span className={`badge bg-${getImpactColor(benefit.impact)}`}>
                                                Impact: {benefit.impact}
                                            </span>
                                            <span className="badge bg-secondary">
                                                ROI: {benefit.roi}
                                            </span>
                                        </div>
                                        {benefit.implementation && (
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    <i className="fas fa-lightbulb me-1"></i>
                                                    {benefit.implementation}
                                                </small>
                                            </div>
                                        )}
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

export default React.memo(BenefitsAnalysisBlock);