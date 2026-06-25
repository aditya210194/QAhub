import React, { useState } from 'react';

const ROICalculationBlock = ({ block }) => {
    const { title, calculations, assumptions } = block;
    const [activeTab, setActiveTab] = useState('summary');

    if (!calculations || !Array.isArray(calculations) || calculations.length === 0) {
        return <div className="alert alert-info my-3 p-3">No ROI calculations available.</div>;
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="roi-calculation-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="card shadow-sm">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
                                onClick={() => setActiveTab('summary')}
                            >
                                Summary
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Details
                            </button>
                        </li>
                        {assumptions && (
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'assumptions' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('assumptions')}
                                >
                                    Assumptions
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="card-body">
                    {activeTab === 'summary' && (
                        <div className="row">
                            {calculations.map((calc, idx) => (
                                <div key={idx} className="col-md-4 mb-3">
                                    <div className="text-center p-3 border rounded">
                                        <h6 className="text-muted">{calc.metric}</h6>
                                        <h3 className={calc.value.includes('-') ? 'text-danger' : 'text-success'}>
                                            {calc.value}
                                        </h3>
                                        <small className="text-muted">{calc.description}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Current Cost</th>
                                    <th>AI Cost</th>
                                    <th>Savings</th>
                                    <th>% Reduction</th>
                                </tr>
                                </thead>
                                <tbody>
                                {calculations.map((calc, idx) => (
                                    <tr key={idx}>
                                        <td>{calc.category}</td>
                                        <td>{formatCurrency(calc.currentCost)}</td>
                                        <td>{formatCurrency(calc.aiCost)}</td>
                                        <td className="text-success">{formatCurrency(calc.savings)}</td>
                                        <td>{calc.reduction}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'assumptions' && assumptions && (
                        <ul className="list-unstyled">
                            {assumptions.map((assumption, idx) => (
                                <li key={idx} className="mb-2">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    {assumption}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ROICalculationBlock);