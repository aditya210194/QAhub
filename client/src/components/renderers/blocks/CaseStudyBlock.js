import React, { useState } from 'react';

const CaseStudyBlock = ({ block, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="case-study card my-4 shadow-sm">
            <div className="card-header bg-primary bg-opacity-10">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0"><i className="fas fa-chart-line me-2 text-primary"></i>{block.title || 'Case Study'}</h5>
                    {(block.analysis?.length > 2 || block.lessons?.length > 2) && (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setExpanded(!expanded)}>
                            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} me-1`}></i>
                            {expanded ? 'Less' : 'More'}
                        </button>
                    )}
                </div>
            </div>
            <div className="card-body">
                {block.metrics && (
                    <div className="case-study-meta mb-3 d-flex flex-wrap gap-2">
                        {Object.entries(block.metrics).map(([key, value]) => <span key={key} className="badge bg-secondary"><strong>{key}:</strong> {value}</span>)}
                    </div>
                )}
                {block.scenario && (
                    <div className="case-study-scenario mb-3">
                        <h6><i className="fas fa-info-circle me-2"></i>Scenario</h6>
                        <p>{block.scenario}</p>
                    </div>
                )}
                {block.problem && (
                    <div className="case-study-problem mb-3">
                        <h6><i className="fas fa-exclamation-triangle text-warning me-2"></i>Problem</h6>
                        <p>{block.problem}</p>
                    </div>
                )}
                {block.solution && (
                    <div className="case-study-solution mb-3">
                        <h6><i className="fas fa-lightbulb text-success me-2"></i>Solution</h6>
                        <p>{block.solution}</p>
                    </div>
                )}
                {block.outcome && (
                    <div className="case-study-outcome mb-3">
                        <h6><i className="fas fa-trophy text-info me-2"></i>Outcome</h6>
                        <p>{block.outcome}</p>
                    </div>
                )}
                {expanded && (
                    <>
                        {block.analysis && (
                            <div className="case-study-analysis mt-3 p-3 bg-light rounded">
                                <h6><i className="fas fa-chart-bar me-2"></i>Analysis</h6>
                                <ul className="mb-0">
                                    {block.analysis.map((item, i) => <li key={i}><strong>{item.failure}:</strong> {item.solution}</li>)}
                                </ul>
                            </div>
                        )}
                        {block.lessons && (
                            <div className="case-study-lessons mt-3 p-3 bg-success bg-opacity-10 rounded">
                                <h6><i className="fas fa-graduation-cap me-2"></i>Key Lessons</h6>
                                <ul className="mb-0">{block.lessons.map((lesson, i) => <li key={i}>{lesson}</li>)}</ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(CaseStudyBlock);