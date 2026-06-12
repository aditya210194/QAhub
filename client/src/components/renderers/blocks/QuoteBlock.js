import React from 'react';

const QuoteBlock = ({ block }) => {
    const content = block.content || block.text;
    const source = block.source;

    if (!content) return null;

    return (
        <blockquote className="blockquote my-3 p-3 bg-light border-start border-5 border-primary">
            <p className="mb-1">{content}</p>
            {source && (
                <footer className="blockquote-footer mt-2">
                    {source}
                </footer>
            )}
        </blockquote>
    );
};

export default React.memo(QuoteBlock);