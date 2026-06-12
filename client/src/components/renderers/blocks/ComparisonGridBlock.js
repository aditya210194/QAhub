// src/components/renderers/blocks/ComparisonGridBlock.js
import React, { useState } from 'react';

const ComparisonGridBlock = ({ block, index }) => {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Extract data from different possible structures
    let { title, headers, rows, highlightBest = true, variant = 'table' } = block;

    // Alternative structure: { columns, data } instead of { headers, rows }
    if (!headers && block.columns) {
        headers = block.columns;
    }
    if (!rows && block.data) {
        rows = block.data;
    }
    if (!rows && block.items) {
        rows = block.items;
    }

    // Handle array of objects format
    if (!headers && rows && rows.length > 0 && typeof rows[0] === 'object') {
        headers = Object.keys(rows[0]);
        rows = rows.map(row => headers.map(h => row[h]));
    }

    // Safety checks
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>📊 Comparison Grid</strong>
                <div className="mt-1 text-muted small">No comparison data available.</div>
                <div className="mt-2 text-muted small">Expected format: headers and rows arrays.</div>
            </div>
        );
    }

    // Auto-generate headers if missing
    if (!headers || !Array.isArray(headers) || headers.length === 0) {
        const firstRow = rows[0];
        if (Array.isArray(firstRow)) {
            headers = firstRow.map((_, idx) => `Column ${idx + 1}`);
        } else if (typeof firstRow === 'object') {
            headers = Object.keys(firstRow);
        } else {
            headers = ['Item', 'Value'];
        }
    }

    const handleSort = (colIndex) => {
        if (sortColumn === colIndex) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(colIndex);
            setSortDirection('asc');
        }
    };

    const sortedRows = [...rows];
    if (sortColumn !== null && sortColumn < headers.length) {
        sortedRows.sort((a, b) => {
            const aVal = Array.isArray(a) ? a[sortColumn] : a[headers[sortColumn]];
            const bVal = Array.isArray(b) ? b[sortColumn] : b[headers[sortColumn]];

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const comparison = String(aVal || '').localeCompare(String(bVal || ''));
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    // Convert rows to array format if needed
    const formattedRows = sortedRows.map(row => {
        if (Array.isArray(row)) return row;
        return headers.map(h => row[h]);
    });

    const findBestInColumn = (colIndex) => {
        if (!highlightBest) return null;
        let bestValue = null;
        let bestIndex = -1;
        formattedRows.forEach((row, idx) => {
            const val = row[colIndex];
            if (typeof val === 'number') {
                if (bestValue === null || val > bestValue) {
                    bestValue = val;
                    bestIndex = idx;
                }
            }
        });
        return bestIndex;
    };

    const bestInColumn = highlightBest ? findBestInColumn(1) : null;

    // Cards variant
    if (variant === 'cards') {
        return (
            <div className="comparison-cards my-4">
                {title && <h4 className="mb-3 text-center">{title}</h4>}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {formattedRows.map((row, idx) => (
                        <div key={idx} className="col">
                            <div className={`card h-100 shadow-sm ${bestInColumn === idx ? 'border-success border-2' : ''}`}>
                                <div className="card-header bg-primary bg-opacity-10">
                                    <h5 className="mb-0">{row[0] || 'Item'}</h5>
                                </div>
                                <div className="card-body">
                                    {headers.slice(1).map((header, colIdx) => (
                                        <div key={colIdx} className="mb-2">
                                            <strong className="text-muted small">{header}:</strong>
                                            <div className={`mt-1 ${bestInColumn === idx && colIdx === 0 ? 'text-success fw-bold' : ''}`}>
                                                {row[colIdx + 1] || 'N/A'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {bestInColumn === idx && (
                                    <div className="card-footer bg-success bg-opacity-10 text-success text-center">
                                        <i className="fas fa-trophy me-1"></i> Best Choice
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Table variant (default)
    return (
        <div className="comparison-grid my-4">
            {title && <h4 className="mb-3">{title}</h4>}
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                    <tr>
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                onClick={() => idx > 0 && handleSort(idx)}
                                style={{ cursor: idx > 0 ? 'pointer' : 'default' }}
                            >
                                {header}
                                {idx > 0 && sortColumn === idx && (
                                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {formattedRows.map((row, idx) => (
                        <tr key={idx} className={bestInColumn === idx ? 'table-success' : ''}>
                            {row.map((cell, colIdx) => (
                                <td key={colIdx} className={colIdx === 0 ? 'fw-bold' : ''}>
                                    {cell !== undefined && cell !== null ? cell : 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(ComparisonGridBlock);