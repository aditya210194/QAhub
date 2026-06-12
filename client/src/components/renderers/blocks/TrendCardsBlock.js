// src/components/renderers/blocks/TrendCardsBlock.js
import React from 'react';

const TrendCardsBlock = ({ block, index }) => {
    const { title, trends, variant = 'cards' } = block;

    // Safety check
    if (!trends || !Array.isArray(trends) || trends.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>📈 Trend Cards</strong>
                <div className="mt-1 text-muted small">No trend data available.</div>
            </div>
        );
    }

    const getTrendColor = (trendValue) => {
        if (!trendValue) return 'secondary';
        const lowerTrend = String(trendValue).toLowerCase();
        if (lowerTrend === 'up' || lowerTrend === 'rising' || lowerTrend === 'high') return 'success';
        if (lowerTrend === 'down' || lowerTrend === 'falling' || lowerTrend === 'low') return 'danger';
        if (lowerTrend === 'stable' || lowerTrend === 'steady' || lowerTrend === 'medium') return 'warning';
        return 'info';
    };

    const getTrendIcon = (trendValue) => {
        if (!trendValue) return 'fa-minus';
        const lowerTrend = String(trendValue).toLowerCase();
        if (lowerTrend === 'up' || lowerTrend === 'rising' || lowerTrend === 'high') return 'fa-arrow-up';
        if (lowerTrend === 'down' || lowerTrend === 'falling' || lowerTrend === 'low') return 'fa-arrow-down';
        if (lowerTrend === 'stable' || lowerTrend === 'steady' || lowerTrend === 'medium') return 'fa-minus';
        return 'fa-chart-line';
    };

    // Helper to safely get string value from trend item
    const getString = (obj, key, defaultValue = '') => {
        if (!obj) return defaultValue;
        if (typeof obj === 'string') return obj;
        if (typeof obj === 'object') {
            const val = obj[key];
            if (typeof val === 'string') return val;
            if (typeof val === 'number') return String(val);
        }
        return defaultValue;
    };

    // Helper to get numeric value
    const getNumber = (obj, key, defaultValue = null) => {
        if (!obj) return defaultValue;
        if (typeof obj === 'object') {
            const val = obj[key];
            if (typeof val === 'number') return val;
            if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
        }
        return defaultValue;
    };

    // List variant
    if (variant === 'list') {
        return (
            <div className="trend-list my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="list-group">
                    {trends.map((trend, idx) => {
                        const trendName = getString(trend, 'name') || getString(trend, 'title') || `Trend ${idx + 1}`;
                        const trendDescription = getString(trend, 'description');
                        const trendValue = getString(trend, 'trend') || getString(trend, 'value');

                        return (
                            <div key={idx} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{trendName}</h6>
                                        {trendDescription && <p className="mb-0 small text-muted">{trendDescription}</p>}
                                    </div>
                                    {trendValue && (
                                        <span className={`badge bg-${getTrendColor(trendValue)} ms-2`}>
                                            <i className={`fas ${getTrendIcon(trendValue)} me-1`}></i>
                                            {trendValue}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Cards variant (default)
    return (
        <div className="trend-cards my-4">
            {title && <h4 className="mb-4 text-center">{title}</h4>}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {trends.map((trend, idx) => {
                    const trendName = getString(trend, 'name') || getString(trend, 'title') || `Trend ${idx + 1}`;
                    const trendDescription = getString(trend, 'description');
                    const trendValue = getString(trend, 'trend') || getString(trend, 'value');
                    const trendIcon = getString(trend, 'icon') || 'fa-chart-line';
                    const trendImpact = getNumber(trend, 'impact');
                    const trendAdoption = getNumber(trend, 'adoption');
                    const trendExample = getString(trend, 'example');

                    return (
                        <div key={idx} className="col">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="trend-icon">
                                            <i className={`fas ${trendIcon} fa-2x text-primary`}></i>
                                        </div>
                                        {trendValue && (
                                            <span className={`badge bg-${getTrendColor(trendValue)} px-3 py-2`}>
                                                <i className={`fas ${getTrendIcon(trendValue)} me-1`}></i>
                                                {trendValue}
                                            </span>
                                        )}
                                    </div>
                                    <h5 className="card-title">{trendName}</h5>
                                    {trendDescription && <p className="card-text text-muted small">{trendDescription}</p>}

                                    {trendImpact !== null && (
                                        <div className="mt-3">
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span className="text-muted">Impact</span>
                                                <span className="text-primary">{trendImpact}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div
                                                    className="progress-bar bg-primary"
                                                    style={{ width: `${Math.min(100, Math.max(0, trendImpact))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {trendAdoption !== null && (
                                        <div className="mt-3">
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span className="text-muted">Adoption</span>
                                                <span className="text-success">{trendAdoption}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div
                                                    className="progress-bar bg-success"
                                                    style={{ width: `${Math.min(100, Math.max(0, trendAdoption))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {trendExample && (
                                    <div className="card-footer bg-transparent border-top">
                                        <small className="text-muted">
                                            <i className="fas fa-lightbulb me-1"></i> {trendExample}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(TrendCardsBlock);