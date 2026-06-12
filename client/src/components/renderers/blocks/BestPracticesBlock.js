import React, { useState } from 'react';

const BestPracticesBlock = ({ block, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="best-practices-section my-4">
            <h3 className="best-practices-title mb-3"><i className="fas fa-star text-warning me-2"></i>{block.title || 'Best Practices'}</h3>
            <div className="best-practices-grid">
                {block.items?.slice(0, expanded ? undefined : 3).map((item, itemIndex) => (
                    <div key={itemIndex} className="best-practice-card card mb-3 border-success">
                        <div className="card-header bg-success bg-opacity-10">
                            <h4 className="practice-title mb-0"><i className="fas fa-check-circle text-success me-2"></i>{item.practice}</h4>
                        </div>
                        <div className="card-body">
                            <p className="practice-benefit text-success mb-2"><strong>Benefit:</strong> {item.benefit}</p>
                            <p className="practice-implementation mb-0"><strong>Implementation:</strong> {item.implementation}</p>
                        </div>
                    </div>
                ))}
            </div>
            {block.items?.length > 3 && (
                <div className="text-center mt-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setExpanded(!expanded)}>
                        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} me-1`}></i>
                        {expanded ? 'Show Less' : `Show ${block.items.length - 3} More`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(BestPracticesBlock);