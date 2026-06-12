import React from 'react';

const ImageBlock = ({ block }) => {
    const src = block.image || block.src;
    const alt = block.alt || block.caption || '';
    const caption = block.caption;

    if (!src) return null;

    return (
        <figure className="text-center my-4">
            <img
                src={src}
                alt={alt}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '400px' }}
                loading="lazy"
            />
            {caption && <figcaption className="mt-2 text-muted small">{caption}</figcaption>}
        </figure>
    );
};

export default React.memo(ImageBlock);