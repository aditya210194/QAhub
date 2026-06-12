import React from 'react';

const DefaultBlock = ({ block, index }) => {
    return (
        <div className="unsupported-block my-3">
            <div className="alert alert-warning">
                Unsupported content type: {block.type}
            </div>
            {block.fallback && (
                <div className="mt-2">
                    {typeof block.fallback === 'string' ? block.fallback : JSON.stringify(block.fallback)}
                </div>
            )}
        </div>
    );
};

export default React.memo(DefaultBlock);