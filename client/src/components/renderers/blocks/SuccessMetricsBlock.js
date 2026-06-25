import React, { useState } from 'react';

const SuccessMetricsBlock = ({ block }) => {
    const { title, metrics } = block;
    const [selectedMetric, setSelectedMetric] = useState(null);

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        return <div className="alert alert-info my-3 p-3">No success metrics available.</div>;
    }

    return (
        <div className="success-metrics-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-primary">
                    <tr>
                        <th>Metric</th>
                        <th>Definition</th>
                        <th>Initial Target</th>
                        <th>Mature Target</th>
                        <th>Frequency</th>
                    </tr>
                    </thead>
                    <tbody>
                    {metrics.map((metric, idx) => (
                        <tr key={idx}>
                            <td>
                                <strong>{metric.metric}</strong>
                            </td>
                            <td className="small">{metric.definition}</td>
                            <td>
                                <span className="badge bg-warning text-dark">{metric['initial-target']}</span>
                            </td>
                            <td>
                                <span className="badge bg-success">{metric['mature-target']}</span>
                            </td>
                            <td>
                                <span className="badge bg-info">{metric['measurement-frequency']}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Track these metrics regularly to measure the success of your AI visual testing implementation.
                </div>
            </div>
        </div>
    );
};

export default React.memo(SuccessMetricsBlock);