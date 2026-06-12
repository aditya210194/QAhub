import React from 'react';
import ReactMarkdown from 'react-markdown';

const TableBlock = ({ block }) => {
    const { columns = [], rows = [], title } = block;

    if (!columns.length || !rows.length) return null;

    return (
        <div className="table-responsive my-4">
            {title && <h5 className="mb-2">{title}</h5>}
            <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                <tr>
                    {columns.map((col, i) => (
                        <th key={i}>{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td key={j}>
                                <ReactMarkdown>{String(cell)}</ReactMarkdown>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(TableBlock);