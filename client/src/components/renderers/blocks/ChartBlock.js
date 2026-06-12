// src/components/renderers/blocks/ChartBlock.js
import React from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';

const ChartBlock = ({ block, index }) => {
    const { chartType, data, title, caption } = block;

    // Function to detect and convert any data format
    const getChartData = () => {
        if (!data) return [];

        // Case 1: Data is already an array
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }

        // Case 2: Data has labels and values
        if (data.labels && Array.isArray(data.labels)) {
            if (data.values && Array.isArray(data.values)) {
                return data.labels.map((label, i) => ({
                    name: label,
                    value: data.values[i]
                }));
            }
            if (data.datasets && data.datasets.length > 0) {
                return data.labels.map((label, i) => ({
                    name: label,
                    ...data.datasets.reduce((acc, ds) => {
                        acc[ds.label || 'value'] = ds.data[i];
                        return acc;
                    }, {})
                }));
            }
        }

        // Case 3: Data is an object with numeric values
        if (typeof data === 'object' && !Array.isArray(data)) {
            const keys = Object.keys(data);
            if (keys.length > 0 && typeof data[keys[0]] === 'number') {
                return keys.map(key => ({
                    name: key,
                    value: data[key]
                }));
            }
        }

        return [];
    };

    const chartData = getChartData();
    const hasData = chartData.length > 0;

    if (!hasData) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>📊 Chart Preview</strong>
                <div className="mt-2 text-muted small">
                    Chart type: {chartType}
                    <br />
                    Data structure: {JSON.stringify(data, null, 2).substring(0, 200)}...
                </div>
            </div>
        );
    }

    const getKeys = () => {
        if (chartData.length === 0) return [];
        const firstItem = chartData[0];
        return Object.keys(firstItem).filter(k => k !== 'name');
    };

    const dataKeys = getKeys();
    const defaultColor = '#8884d8';

    const renderChart = () => {
        switch (chartType) {
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill={defaultColor}
                                dataKey={dataKeys[0] || 'value'}
                                nameKey="name"
                            >
                                {chartData.map((_, idx) => (
                                    <Cell key={`cell-${idx}`} fill={`hsl(${idx * 45}, 70%, 60%)`} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {dataKeys.map((key, idx) => (
                                <Bar key={key} dataKey={key} fill={`hsl(${idx * 45}, 70%, 60%)`} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {dataKeys.map((key, idx) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={`hsl(${idx * 45}, 70%, 60%)`} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {dataKeys.map((key, idx) => (
                                <Area key={key} type="monotone" dataKey={key} stroke={`hsl(${idx * 45}, 70%, 60%)`} fill={`hsl(${idx * 45}, 70%, 60%)`} fillOpacity={0.3} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );

            default:
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey={dataKeys[0] || 'value'} fill={defaultColor} />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="chart-block my-4 p-3 bg-light rounded">
            {title && <h5 className="mb-3 text-center">{title}</h5>}
            {renderChart()}
            {caption && <div className="text-center text-muted small mt-2">{caption}</div>}
        </div>
    );
};

export default React.memo(ChartBlock);