// src/components/renderers/blocks/MetricsGridBlock.js
import React from 'react';

const MetricsGridBlock = ({ block, index }) => {
    const { title, metrics, columns = 4, showProgress = true, variant = 'cards' } = block;

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>📊 Metrics Grid</strong>
                <div className="mt-1 text-muted small">No metrics data available.</div>
            </div>
        );
    }

    const getTrendIcon = (trend) => {
        if (!trend) return null;
        if (trend === 'up') return <i className="fas fa-arrow-up text-success ms-1"></i>;
        if (trend === 'down') return <i className="fas fa-arrow-down text-danger ms-1"></i>;
        return <i className="fas fa-minus text-warning ms-1"></i>;
    };

    if (variant === 'table') {
        return (
            <div className="metrics-table my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Target</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {metrics.map((metric, idx) => (
                            <tr key={idx}>
                                <td><strong>{metric.name}</strong></td>
                                <td>{metric.value}</td>
                                <td>{metric.target || 'N/A'}</td>
                                <td>
                                        <span className={`badge bg-${metric.status === 'good' ? 'success' : metric.status === 'warning' ? 'warning' : 'danger'}`}>
                                            {metric.status || 'neutral'}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="metrics-grid my-4">
            {title && <h4 className="mb-4 text-center">{title}</h4>}
            <div className={`row row-cols-1 row-cols-md-2 row-cols-lg-${columns} g-4`}>
                {metrics.map((metric, idx) => (
                    <div key={idx} className="col">
                        <div className="metric-card card h-100 shadow-sm text-center">
                            <div className="card-body">
                                <div className="metric-icon mb-3">
                                    <i className={`fas ${metric.icon || 'fa-chart-line'} fa-2x text-primary`}></i>
                                </div>
                                <div className="metric-value display-5 fw-bold text-primary">
                                    {metric.value}
                                </div>
                                <h6 className="metric-name mt-2">{metric.name}</h6>
                                <p className="metric-description small text-muted">{metric.description}</p>
                                {showProgress && metric.progress !== undefined && (
                                    <div className="metric-progress mt-2">
                                        <div className="progress" style={{ height: '4px' }}>
                                            <div
                                                className="progress-bar bg-primary"
                                                style={{ width: `${metric.progress}%` }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">{metric.progress}% to target</small>
                                    </div>
                                )}
                                {metric.trend && (
                                    <div className="metric-trend mt-2">
                                        <small className="text-muted">
                                            Trend: {getTrendIcon(metric.trend)}
                                        </small>
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

export default React.memo(MetricsGridBlock);