import React from 'react';
import ContentRenderer from '../ContentRenderer';

const ConclusionBlock = ({ block, ...props }) => {
    const { title, summary, keyTakeaways, callToAction } = block;

    return (
        <div className="conclusion-block my-5 p-4 bg-light rounded">
            <div className="text-center mb-4">
                <i className="fas fa-flag-checkered fa-3x text-primary mb-3"></i>
                <h2>{title || 'Conclusion'}</h2>
            </div>
            {summary && <p className="lead">{summary}</p>}
            {keyTakeaways && (
                <div className="key-takeaways mt-4">
                    <h4><i className="fas fa-key me-2"></i>Key Takeaways</h4>
                    <ul>
                        {keyTakeaways.map((takeaway, i) => (
                            <li key={i}>{takeaway}</li>
                        ))}
                    </ul>
                </div>
            )}
            {callToAction && (
                <div className="text-center mt-4">
                    <a href={callToAction.link} className="btn btn-primary btn-lg">
                        {callToAction.text} <i className="fas fa-arrow-right ms-2"></i>
                    </a>
                </div>
            )}
        </div>
    );
};

export default React.memo(ConclusionBlock);