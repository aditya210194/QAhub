// src/components/renderers/blocks/StatisticBlock.js
import React from 'react';

const StatisticBlock = ({ block, index }) => {
    // Safely extract values
    let title = '';
    let value = '';
    let unit = '';
    let trend = null;
    let source = '';
    let icon = 'fa-chart-bar';

    if (typeof block === 'object') {
        title = block.title || block.label || '';
        value = block.value || block.stat || block.number || '';
        unit = block.unit || '';
        trend = block.trend || null;
        source = block.source || '';
        icon = block.icon || 'fa-chart-bar';
    } else if (typeof block === 'string') {
        value = block;
    } else if (typeof block === 'number') {
        value = String(block);
    }

    if (!title && !value) {
        return (
            <div className="alert alert-info my-2 p-2">
                <strong>📊 Statistic</strong>
                <div className="mt-1 text-muted small">No statistic data available.</div>
            </div>
        );
    }

    const getTrendIcon = () => {
        if (!trend) return null;
        const lowerTrend = String(trend).toLowerCase();
        if (lowerTrend === 'up' || lowerTrend === 'increase') {
            return <i className="fas fa-arrow-up text-success ms-1"></i>;
        }
        if (lowerTrend === 'down' || lowerTrend === 'decrease') {
            return <i className="fas fa-arrow-down text-danger ms-1"></i>;
        }
        return <i className="fas fa-minus text-warning ms-1"></i>;
    };

    const getTrendColor = () => {
        if (!trend) return '';
        const lowerTrend = String(trend).toLowerCase();
        if (lowerTrend === 'up' || lowerTrend === 'increase') return 'text-success';
        if (lowerTrend === 'down' || lowerTrend === 'decrease') return 'text-danger';
        return 'text-warning';
    };

    return (
        <div className="statistic-block d-flex align-items-center p-3 my-2 bg-light rounded border">
            <div className="stat-icon me-3">
                <i className={`fas ${icon} fa-2x text-primary`}></i>
            </div>
            <div className="stat-content flex-grow-1">
                {title && <div className="stat-title text-muted small">{title}</div>}
                <div className="stat-value display-6 fw-bold">
                    {value}{unit && <span className="fs-6 fw-normal text-muted ms-1">{unit}</span>}
                    {trend && <span className={`ms-2 ${getTrendColor()}`}>{getTrendIcon()}</span>}
                </div>
                {source && <div className="stat-source text-muted small mt-1">Source: {source}</div>}
            </div>
        </div>
    );
};

export default React.memo(StatisticBlock);