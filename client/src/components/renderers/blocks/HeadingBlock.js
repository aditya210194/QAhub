import React from 'react';

const HeadingBlock = ({ block, index }) => {
    const level = block.level || 2;
    const text = block.text || block.content;
    const align = block.align || 'left';
    const icon = block.icon;

    const HeadingTag = `h${level}`;

    const headingStyle = {
        textAlign: align,
        ...(block.color && { color: block.color })
    };

    return (
        <div className={`heading-wrapper ${block.divider ? 'with-divider' : ''}`} style={{ textAlign: align }}>
            <HeadingTag className={`heading-${level} my-${level === 1 ? '4' : level === 2 ? '3' : '2'}`} style={headingStyle}>
                {icon && <i className={`me-2 ${icon}`}></i>}
                {text}
                {block.badge && (
                    <span className="heading-badge ms-2 badge bg-primary">
            {block.badge}
          </span>
                )}
                {block.subtext && (
                    <small className="heading-subtext ms-2 text-muted">
                        {block.subtext}
                    </small>
                )}
            </HeadingTag>
        </div>
    );
};

export default React.memo(HeadingBlock);