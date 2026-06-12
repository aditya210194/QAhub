// src/components/renderers/blocks/InfographicBlock.js
import React from 'react';

const InfographicBlock = ({ block, index }) => {
    const { title, items, variant = 'steps', image, caption } = block;

    if (image) {
        return (
            <div className="infographic-block my-4 text-center">
                {title && <h5 className="mb-3">{title}</h5>}
                <img src={image} alt={title || 'Infographic'} className="img-fluid rounded shadow-sm" loading="lazy" />
                {caption && <div className="text-muted small mt-2">{caption}</div>}
            </div>
        );
    }

    if (variant === 'steps' && items) {
        return (
            <div className="infographic-steps my-4">
                {title && <h4 className="mb-4 text-center">{title}</h4>}
                <div className="row">
                    {items.map((item, idx) => (
                        <div key={idx} className="col-md-3 col-6 mb-3">
                            <div className="text-center">
                                <div className="step-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                                    {idx + 1}
                                </div>
                                <strong>{item.title}</strong>
                                <p className="small text-muted mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'stats' && items) {
        return (
            <div className="infographic-stats my-4 p-4 bg-primary bg-opacity-10 rounded">
                {title && <h4 className="mb-4 text-center">{title}</h4>}
                <div className="row text-center">
                    {items.map((item, idx) => (
                        <div key={idx} className="col-md-3 col-6 mb-3">
                            <div className="stat-value display-4 fw-bold text-primary">{item.value}</div>
                            <div className="stat-label text-muted">{item.label}</div>
                            {item.trend && (
                                <div className={`small ${item.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                                    <i className={`fas fa-arrow-${item.trend === 'up' ? 'up' : 'down'} me-1`}></i>
                                    {item.change}%
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'progress' && items) {
        return (
            <div className="infographic-progress my-4">
                {title && <h4 className="mb-4">{title}</h4>}
                {items.map((item, idx) => (
                    <div key={idx} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <span>{item.label}</span>
                            <span className="text-primary fw-bold">{item.value}%</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div className="progress-bar bg-primary" style={{ width: `${item.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="infographic-block my-4 p-3 bg-light rounded">
            {title && <h5 className="mb-3">{title}</h5>}
            <div className="infographic-content">
                {items?.map((item, idx) => (
                    <div key={idx} className="mb-2 p-2 border-bottom">
                        <strong>{item.title}:</strong> {item.description}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(InfographicBlock);