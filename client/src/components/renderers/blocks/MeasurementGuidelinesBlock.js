import React, { useState } from 'react';

const MeasurementGuidelinesBlock = ({ block }) => {
    const { title, guidelines, variant = 'cards' } = block;
    const [expanded, setExpanded] = useState(null);

    if (!guidelines || !Array.isArray(guidelines) || guidelines.length === 0) {
        return <div className="alert alert-info my-2 p-3">No measurement guidelines available.</div>;
    }

    if (variant === 'table') {
        return (
            <div className="measurement-guidelines my-4">
                {title && <h3 className="mb-3">{title}</h3>}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr><th>Metric</th><th>Measurement</th><th>Target</th><th>Frequency</th></tr>
                        </thead>
                        <tbody>
                        {guidelines.map((item, idx) => (
                            <tr key={idx}>
                                <td><strong>{item.metric}</strong></td>
                                <td>{item.measurement}</td>
                                <td>{item.target}</td>
                                <td>{item.frequency}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="measurement-guidelines my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                {guidelines.map((item, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header bg-info bg-opacity-10">
                                <h5 className="mb-0">{item.metric}</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-2"><strong>Measurement:</strong> {item.measurement}</div>
                                <div className="mb-2"><strong>Target:</strong> <span className="text-success">{item.target}</span></div>
                                <div><strong>Frequency:</strong> {item.frequency}</div>
                                {item.formula && expanded === idx && (
                                    <div className="mt-3 p-2 bg-light rounded">
                                        <strong>Formula:</strong> <code>{item.formula}</code>
                                    </div>
                                )}
                            </div>
                            {item.formula && (
                                <div className="card-footer bg-transparent">
                                    <button className="btn btn-sm btn-link" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                                        {expanded === idx ? 'Hide formula' : 'Show formula'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(MeasurementGuidelinesBlock);