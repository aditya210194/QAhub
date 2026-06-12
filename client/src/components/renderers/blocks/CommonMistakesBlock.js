import React, { useState } from 'react';

const CommonMistakesBlock = ({ block, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="common-mistakes-block card my-4 border-danger">
            <div className="card-header bg-danger bg-opacity-10">
                <h5 className="mb-0"><i className="fas fa-exclamation-triangle text-danger me-2"></i>{block.title || 'Common Mistakes to Avoid'}</h5>
            </div>
            <div className="card-body">
                {block.mistakes?.slice(0, expanded ? undefined : 3).map((mistake, i) => (
                    <div key={i} className="mistake-item mb-3 pb-3 border-bottom">
                        <h6 className="text-danger mb-2"><i className="fas fa-times-circle me-2"></i>{mistake.mistake}</h6>
                        <div className="row">
                            <div className="col-md-4"><small className="text-muted"><strong>Risk:</strong></small><p className="small">{mistake.risk}</p></div>
                            <div className="col-md-4"><small className="text-muted"><strong>Solution:</strong></small><p className="small text-success">{mistake.solution}</p></div>
                            <div className="col-md-4"><small className="text-muted"><strong>Check:</strong></small><p className="small">{mistake.check}</p></div>
                        </div>
                    </div>
                ))}
                {block.mistakes?.length > 3 && (
                    <div className="text-center mt-2">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setExpanded(!expanded)}>
                            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} me-1`}></i>
                            {expanded ? 'Show Less' : `Show ${block.mistakes.length - 3} More`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(CommonMistakesBlock);