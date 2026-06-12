import React, { useState } from 'react';

const FactorAnalysisBlock = ({ block }) => {
    const { title, factors, weights, interactive = false } = block;
    const [ratings, setRatings] = useState({});

    if (!factors || !Array.isArray(factors) || factors.length === 0) {
        return <div className="alert alert-info my-2 p-3">No factor analysis data available.</div>;
    }

    const handleRating = (factorIdx, value) => {
        if (!interactive) return;
        setRatings(prev => ({ ...prev, [factorIdx]: value }));
    };

    const calculateScore = () => {
        let totalScore = 0;
        factors.forEach((factor, idx) => {
            const rating = ratings[idx] || 0;
            const weight = weights?.[idx] || 1;
            totalScore += rating * weight;
        });
        return totalScore;
    };

    return (
        <div className="factor-analysis my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-light">
                    <tr>
                        <th>Factor</th>
                        <th>Description</th>
                        <th>Impact</th>
                        {interactive && <th>Rating (1-5)</th>}
                        {!interactive && <th>Score</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {factors.map((factor, idx) => (
                        <tr key={idx}>
                            <td><strong>{factor.name}</strong></td>
                            <td>{factor.description}</td>
                            <td>
                                    <span className={`badge bg-${factor.impact === 'High' ? 'danger' : factor.impact === 'Medium' ? 'warning' : 'info'}`}>
                                        {factor.impact}
                                    </span>
                            </td>
                            {interactive ? (
                                <td>
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i
                                                key={star}
                                                className={`fas fa-star ${ratings[idx] >= star ? 'text-warning' : 'text-muted'} cursor-pointer`}
                                                onClick={() => handleRating(idx, star)}
                                                style={{ cursor: 'pointer', marginRight: '4px' }}
                                            ></i>
                                        ))}
                                    </div>
                                </td>
                            ) : (
                                <td className="text-center fw-bold">{factor.score || factor.value || 'N/A'}</td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                    {interactive && (
                        <tfoot className="table-primary">
                        <tr>
                            <td colSpan="3" className="text-end fw-bold">Total Score:</td>
                            <td className="text-center fw-bold">{calculateScore()}</td>
                        </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            {interactive && (
                <div className="alert alert-info mt-3">
                    <i className="fas fa-info-circle me-2"></i>
                    Rate each factor from 1 (Low) to 5 (High) to calculate your total impact score.
                </div>
            )}
        </div>
    );
};

export default React.memo(FactorAnalysisBlock);