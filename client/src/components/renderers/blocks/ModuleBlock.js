import React, { useState } from 'react';
import ContentRenderer from '../ContentRenderer';

const ModuleBlock = ({ block, ...props }) => {
    const [expanded, setExpanded] = useState(false);
    const { title, content, duration, level, objectives, prerequisites } = block;

    return (
        <div className="module-block card my-4 border-primary">
            <div className="card-header bg-primary bg-opacity-10">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">{title}</h3>
                    <div className="d-flex gap-2">
                        {duration && <span className="badge bg-secondary"><i className="fas fa-clock me-1"></i>{duration}</span>}
                        {level && <span className="badge bg-info">{level}</span>}
                    </div>
                </div>
            </div>
            <div className="card-body">
                {objectives && (
                    <div className="mb-3 p-2 bg-light rounded">
                        <strong><i className="fas fa-bullseye me-2"></i>Learning Objectives:</strong>
                        <ul className="mb-0 mt-1">
                            {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                    </div>
                )}
                <ContentRenderer content={content} {...props} />
                {prerequisites && expanded && (
                    <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                        <strong><i className="fas fa-clipboard-list me-2"></i>Prerequisites:</strong>
                        <ul className="mb-0 mt-1">
                            {prerequisites.map((pre, i) => <li key={i}>{pre}</li>)}
                        </ul>
                    </div>
                )}
                {prerequisites && (
                    <button className="btn btn-sm btn-link mt-2" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Show less' : 'Show prerequisites'}
                        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} ms-1`}></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(ModuleBlock);