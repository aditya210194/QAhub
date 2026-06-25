import React, { useState } from 'react';

const ApplicationsGridBlock = ({ block }) => {
    const { title, applications } = block;
    const [selectedApp, setSelectedApp] = useState(null);

    if (!applications || !Array.isArray(applications) || applications.length === 0) {
        return <div className="alert alert-info my-3 p-3">No applications available.</div>;
    }

    return (
        <div className="applications-grid-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="row g-4">
                {applications.map((app, idx) => (
                    <div key={idx} className="col-lg-4 col-md-6">
                        <div
                            className="card h-100 shadow-sm border-0 cursor-pointer"
                            onMouseEnter={() => setSelectedApp(idx)}
                            onMouseLeave={() => setSelectedApp(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-header bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <h6 className="mb-0">{app.application}</h6>
                            </div>
                            <div className="card-body">
                                <p className="small">{app.description}</p>

                                {selectedApp === idx && (
                                    <div className="mt-3">
                                        <strong className="small">Capabilities:</strong>
                                        <ul className="small list-unstyled mt-1">
                                            {app.capabilities && app.capabilities.map((cap, i) => (
                                                <li key={i} className="mb-1">
                                                    <i className="fas fa-check-circle text-success me-1"></i>
                                                    {cap}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-2">
                                            <span className="badge bg-info">
                                                Impact: {app['business-impact']}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <small className="text-muted">
                                    {selectedApp === idx ? 'Showing details...' : 'Hover for details'}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(ApplicationsGridBlock);