import React, { useState } from 'react';

const DashboardBlock = ({ block }) => {
    const { title, widgets, layout = 'grid', columns = 3 } = block;

    if (!widgets || !Array.isArray(widgets) || widgets.length === 0) {
        return <div className="alert alert-info my-2 p-3">No dashboard widgets available.</div>;
    }

    const getColumnClass = () => {
        const colMap = { 1: 'col-12', 2: 'col-md-6', 3: 'col-md-4', 4: 'col-md-3' };
        return colMap[columns] || 'col-md-4';
    };

    const getValueColor = (value, trend) => {
        if (trend === 'up') return 'text-success';
        if (trend === 'down') return 'text-danger';
        return 'text-primary';
    };

    if (layout === 'kpi') {
        return (
            <div className="dashboard-kpi my-4">
                {title && <h3 className="mb-4">{title}</h3>}
                <div className="row g-4">
                    {widgets.map((widget, idx) => (
                        <div key={idx} className="col-md-3 col-sm-6">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <div className="dashboard-icon mb-2">
                                        <i className={`fas ${widget.icon || 'fa-chart-line'} fa-2x text-primary`}></i>
                                    </div>
                                    <h2 className={`mb-0 ${getValueColor(widget.value, widget.trend)}`}>{widget.value}</h2>
                                    <p className="text-muted small mb-0">{widget.label}</p>
                                    {widget.trend && (
                                        <small className={`${widget.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                                            <i className={`fas fa-arrow-${widget.trend === 'up' ? 'up' : 'down'} me-1`}></i>
                                            {widget.change}%
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-widgets my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                {widgets.map((widget, idx) => (
                    <div key={idx} className={getColumnClass()}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">{widget.title}</h5>
                            </div>
                            <div className="card-body">
                                {widget.chartType === 'progress' ? (
                                    <div className="text-center">
                                        <div className="display-4 fw-bold text-primary">{widget.value}%</div>
                                        <div className="progress mt-2" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${widget.value}%` }}></div>
                                        </div>
                                        <p className="text-muted small mt-2">{widget.description}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="dashboard-value display-6 fw-bold text-primary">{widget.value}</div>
                                        <p className="text-muted small">{widget.description}</p>
                                        {widget.items && (
                                            <ul className="mb-0 mt-2">
                                                {widget.items.map((item, i) => (
                                                    <li key={i} className="small">{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(DashboardBlock);