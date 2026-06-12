import React, { useState } from 'react';

const TestDesignTechniquesBlock = ({ block }) => {
    const { title, techniques, variant = 'cards', showExamples = true } = block;
    const [selectedTechnique, setSelectedTechnique] = useState(null);

    if (!techniques || !Array.isArray(techniques) || techniques.length === 0) {
        return <div className="alert alert-info my-2 p-3">No test design techniques available.</div>;
    }

    if (variant === 'table') {
        return (
            <div className="test-design-techniques-table my-4">
                {title && <h3 className="mb-3">{title}</h3>}
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                        <tr>
                            <th>Technique</th>
                            <th>Description</th>
                            <th>When to Use</th>
                            <th>Effectiveness</th>
                        </tr>
                        </thead>
                        <tbody>
                        {techniques.map((tech, idx) => (
                            <tr key={idx}>
                                <td><strong>{tech.name}</strong></td>
                                <td>{tech.description}</td>
                                <td>{tech.whenToUse}</td>
                                <td>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-success" style={{ width: `${tech.effectiveness}%` }}></div>
                                    </div>
                                    <small className="text-muted">{tech.effectiveness}%</small>
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
        <div className="test-design-techniques my-4">
            {title && <h3 className="mb-4 text-center">{title}</h3>}
            <div className="row g-4">
                {techniques.map((tech, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{tech.name}</h5>
                                <span className={`badge bg-${tech.difficulty === 'Advanced' ? 'danger' : tech.difficulty === 'Intermediate' ? 'warning' : 'success'}`}>
                                    {tech.difficulty || 'Beginner'}
                                </span>
                            </div>
                            <div className="card-body">
                                <p className="small">{tech.description}</p>
                                <div className="row mt-2">
                                    <div className="col-6">
                                        <small className="text-muted">Best for:</small>
                                        <div className="small">{tech.bestFor}</div>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted">Coverage:</small>
                                        <div className="progress mt-1" style={{ height: '4px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${tech.coverage || 70}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                {selectedTechnique === idx && showExamples && tech.example && (
                                    <div className="mt-3 p-2 bg-light rounded">
                                        <strong>Example:</strong>
                                        <pre className="small mb-0 mt-1 overflow-auto">
                                            <code>{tech.example}</code>
                                        </pre>
                                    </div>
                                )}
                                {tech.steps && selectedTechnique === idx && (
                                    <div className="mt-2">
                                        <strong>Steps:</strong>
                                        <ol className="small mb-0 mt-1">
                                            {tech.steps.map((step, i) => <li key={i}>{step}</li>)}
                                        </ol>
                                    </div>
                                )}
                            </div>
                            {showExamples && tech.example && (
                                <div className="card-footer bg-transparent">
                                    <button className="btn btn-sm btn-link" onClick={() => setSelectedTechnique(selectedTechnique === idx ? null : idx)}>
                                        {selectedTechnique === idx ? 'Hide example' : 'View example'}
                                        <i className={`fas fa-chevron-${selectedTechnique === idx ? 'up' : 'down'} ms-1`}></i>
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

export default React.memo(TestDesignTechniquesBlock);