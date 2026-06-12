import React from 'react';

const FutureTrendsBlock = ({ block }) => {
    const { title, trends, predictions, timeframe = '2025-2030' } = block;

    return (
        <div className="future-trends my-4">
            {title && <h2 className="text-center mb-3">{title}</h2>}
            <div className="text-center mb-4">
                <span className="badge bg-primary px-3 py-2">Timeframe: {timeframe}</span>
            </div>
            <div className="row g-4">
                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <h4 className="mb-0"><i className="fas fa-crystal-ball me-2"></i>Emerging Trends</h4>
                        </div>
                        <div className="card-body">
                            {trends?.map((trend, idx) => (
                                <div key={idx} className={`trend-item p-3 mb-3 border rounded ${trend.impact === 'High' ? 'border-danger' : 'border-info'}`}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h5 className="mb-1">{trend.name}</h5>
                                        <span className={`badge bg-${trend.impact === 'High' ? 'danger' : 'info'}`}>{trend.impact} Impact</span>
                                    </div>
                                    <p className="text-muted small mt-1">{trend.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span><i className="fas fa-chart-line me-1"></i>Adoption: {trend.adoption || 'Growing'}</span>
                                        {trend.timeline && <span><i className="fas fa-calendar me-1"></i>{trend.timeline}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card h-100">
                        <div className="card-header bg-info text-white">
                            <h4 className="mb-0"><i className="fas fa-brain me-2"></i>Predictions</h4>
                        </div>
                        <div className="card-body">
                            {predictions?.map((pred, idx) => (
                                <div key={idx} className="prediction-item d-flex mb-3 p-2 border-bottom">
                                    <div className="prediction-year me-3">
                                        <span className="badge bg-primary rounded-circle p-2" style={{ width: '50px' }}>{pred.year}</span>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0">{pred.description}</p>
                                        {pred.confidence && <small className="text-muted">Confidence: {pred.confidence}%</small>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card mt-4">
                        <div className="card-body text-center">
                            <i className="fas fa-clock fa-2x text-primary mb-2"></i>
                            <h6>Are you ready for the future of QA?</h6>
                            <p className="small text-muted mb-0">Stay ahead by upskilling in these emerging areas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FutureTrendsBlock);