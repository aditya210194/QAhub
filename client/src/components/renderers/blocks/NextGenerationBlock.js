import React from 'react';

const NextGenerationBlock = ({ block }) => {
    const { title, technologies, predictions, timeline } = block;

    return (
        <div className="next-generation my-4">
            {title && <h2 className="text-center mb-4">{title}</h2>}
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card h-100 border-primary">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0"><i className="fas fa-microchip me-2"></i>Emerging Technologies</h4>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {technologies?.map((tech, idx) => (
                                    <div key={idx} className="col-12">
                                        <div className="d-flex align-items-start p-2 border rounded">
                                            <div className="tech-icon me-3">
                                                <i className={`fas ${tech.icon || 'fa-cogs'} fa-2x text-primary`}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{tech.name}</h6>
                                                <p className="small text-muted mb-0">{tech.description}</p>
                                                <span className="badge bg-info mt-1">Expected: {tech.timeline}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 border-success">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0"><i className="fas fa-chart-line me-2"></i>Predictions</h4>
                        </div>
                        <div className="card-body">
                            {predictions?.map((pred, idx) => (
                                <div key={idx} className="prediction-item mb-3 p-2 border-bottom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-1">{pred.title}</h6>
                                        <span className="badge bg-secondary">{pred.timeline}</span>
                                    </div>
                                    <p className="small text-muted mb-0">{pred.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {timeline && (
                <div className="timeline-preview mt-4 p-3 bg-light rounded">
                    <h5><i className="fas fa-calendar-alt me-2"></i>Adoption Timeline</h5>
                    <div className="d-flex justify-content-between mt-3">
                        {timeline.map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="timeline-dot bg-primary rounded-circle mx-auto mb-2" style={{ width: '12px', height: '12px' }}></div>
                                <strong>{item.year}</strong>
                                <div className="small text-muted">{item.event}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(NextGenerationBlock);