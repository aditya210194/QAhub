import React, { useState } from 'react';

const TrendsBlock = ({ block }) => {
    const { title, trends, categories, variant = 'cards' } = block;
    const [activeCategory, setActiveCategory] = useState('all');

    if (!trends || !Array.isArray(trends) || trends.length === 0) {
        return <div className="alert alert-info my-2 p-3">No trends data available.</div>;
    }

    const filteredTrends = activeCategory === 'all' ? trends : trends.filter(t => t.category === activeCategory);

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <i className="fas fa-arrow-up text-success"></i>;
        if (trend === 'down') return <i className="fas fa-arrow-down text-danger"></i>;
        return <i className="fas fa-minus text-warning"></i>;
    };

    if (variant === 'timeline') {
        return (
            <div className="trends-timeline my-4">
                {title && <h3 className="mb-4">{title}</h3>}
                <div className="timeline">
                    {filteredTrends.map((trend, idx) => (
                        <div key={idx} className="timeline-item d-flex mb-4">
                            <div className="timeline-year bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                {trend.year}
                            </div>
                            <div className="timeline-content ms-3 p-3 bg-light rounded flex-grow-1">
                                <h5>{trend.title}</h5>
                                <p>{trend.description}</p>
                                <span className="badge bg-info">{trend.category}</span>
                                <span className="badge bg-secondary ms-2">{getTrendIcon(trend.momentum)} {trend.momentum}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="trends-cards my-4">
            {title && <h3 className="mb-3">{title}</h3>}
            {categories && (
                <div className="trends-categories mb-3 d-flex flex-wrap gap-2">
                    <button className={`btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setActiveCategory('all')}>All</button>
                    {categories.map((cat, idx) => (
                        <button key={idx} className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setActiveCategory(cat.id)}>{cat.name}</button>
                    ))}
                </div>
            )}
            <div className="row g-4">
                {filteredTrends.map((trend, idx) => (
                    <div key={idx} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title">{trend.title}</h5>
                                    {getTrendIcon(trend.momentum)}
                                </div>
                                <p className="card-text small">{trend.description}</p>
                                <div className="mt-2">
                                    <span className="badge bg-info">{trend.category}</span>
                                    <span className="badge bg-secondary ms-2">Impact: {trend.impact}%</span>
                                </div>
                                {trend.adoption && (
                                    <div className="mt-2">
                                        <small className="text-muted">Adoption Rate:</small>
                                        <div className="progress mt-1" style={{ height: '4px' }}>
                                            <div className="progress-bar bg-success" style={{ width: `${trend.adoption}%` }}></div>
                                        </div>
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

export default React.memo(TrendsBlock);