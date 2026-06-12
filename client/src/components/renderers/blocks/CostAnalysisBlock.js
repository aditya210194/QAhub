import React, { useState } from 'react';

const CostAnalysisBlock = ({ block }) => {
    const { title, costs, savings, comparison, currency = '$' } = block;
    const [showBreakdown, setShowBreakdown] = useState(false);

    const totalCost = costs?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
    const totalSavings = savings?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;
    const roi = totalCost > 0 ? ((totalSavings - totalCost) / totalCost * 100).toFixed(1) : 0;

    return (
        <div className="cost-analysis my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card text-center bg-danger bg-opacity-10 border-danger">
                        <div className="card-body">
                            <i className="fas fa-dollar-sign fa-2x text-danger mb-2"></i>
                            <h2 className="text-danger">{currency}{totalCost.toLocaleString()}</h2>
                            <p className="mb-0">Total Cost</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center bg-success bg-opacity-10 border-success">
                        <div className="card-body">
                            <i className="fas fa-chart-line fa-2x text-success mb-2"></i>
                            <h2 className="text-success">{currency}{totalSavings.toLocaleString()}</h2>
                            <p className="mb-0">Total Savings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`card text-center ${roi >= 0 ? 'bg-primary' : 'bg-warning'} bg-opacity-10 border-${roi >= 0 ? 'primary' : 'warning'}`}>
                        <div className="card-body">
                            <i className="fas fa-percent fa-2x mb-2"></i>
                            <h2 className={roi >= 0 ? 'text-primary' : 'text-warning'}>{roi}%</h2>
                            <p className="mb-0">ROI</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Cost Breakdown</h5>
                        </div>
                        <div className="card-body">
                            {costs?.map((cost, idx) => (
                                <div key={idx} className="d-flex justify-content-between mb-2">
                                    <span>{cost.name}</span>
                                    <span className="fw-bold">{currency}{cost.amount?.toLocaleString()}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>{currency}{totalCost.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Savings Breakdown</h5>
                        </div>
                        <div className="card-body">
                            {savings?.map((saving, idx) => (
                                <div key={idx} className="d-flex justify-content-between mb-2">
                                    <span>{saving.name}</span>
                                    <span className="fw-bold text-success">{currency}{saving.amount?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {comparison && (
                <div className="mt-4">
                    <button className="btn btn-outline-primary" onClick={() => setShowBreakdown(!showBreakdown)}>
                        {showBreakdown ? 'Hide' : 'Show'} Comparison Breakdown
                    </button>
                    {showBreakdown && (
                        <div className="mt-3 p-3 bg-light rounded">
                            <pre className="mb-0 small">{comparison}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(CostAnalysisBlock);