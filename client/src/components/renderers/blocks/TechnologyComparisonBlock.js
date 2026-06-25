import React from 'react';

const TechnologyComparisonBlock = ({ block }) => {
    const { title, headers, rows } = block;

    if (!headers || !rows || !Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    return (
        <div className="technology-comparison-block my-4">
            {title && <h5 className="mb-3">{title}</h5>}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={idx} scope="col">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            {row.map((cell, cellIdx) => (
                                <td key={cellIdx}>
                                    {cellIdx === 0 ? <strong>{cell}</strong> : cell}
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

export default React.memo(TechnologyComparisonBlock);