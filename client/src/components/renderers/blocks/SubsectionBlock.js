// src/components/renderers/blocks/SubsectionBlock.js
import React, { useState } from 'react';
import ContentRenderer from '../ContentRenderer';

const SubsectionBlock = ({ block, index, depth = 0, renderBlock, ...props }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { title, content, icon, collapsible, variant, level = 1 } = block;

    // Determine heading level based on depth
    const HeadingTag = `h${Math.min(level + 2, 6)}`;

    // Variant styles
    const variantStyles = {
        default: { borderLeft: 'none', paddingLeft: '0' },
        indented: { borderLeft: '3px solid #0d6efd', paddingLeft: '1rem' },
        highlighted: { backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' },
        bordered: { border: '1px solid #dee2e6', padding: '1rem', borderRadius: '8px' },
    };

    const style = variantStyles[variant] || variantStyles.default;

    const toggleCollapse = () => {
        if (collapsible) {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div
            className={`subsection-block my-3 ${collapsible ? 'collapsible' : ''}`}
            style={style}
            data-depth={depth}
        >
            {title && (
                <div
                    className={`subsection-header d-flex align-items-center ${collapsible ? 'cursor-pointer' : ''}`}
                    onClick={toggleCollapse}
                    style={collapsible ? { cursor: 'pointer' } : {}}
                >
                    {collapsible && (
                        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'down'} me-2 text-muted`} style={{ fontSize: '12px' }}></i>
                    )}
                    {icon && <i className={`${icon} me-2 text-primary`}></i>}
                    <HeadingTag className={`subsection-title mb-0 ${variant === 'highlighted' ? 'h5' : 'h6'}`}>
                        {title}
                    </HeadingTag>
                    {block.badge && (
                        <span className="badge bg-secondary ms-2">{block.badge}</span>
                    )}
                </div>
            )}

            {(!collapsible || !isCollapsed) && (
                <div className="subsection-content mt-2">
                    {typeof content === 'string' ? (
                        <ContentRenderer content={content} {...props} />
                    ) : Array.isArray(content) ? (
                        content.map((subBlock, idx) =>
                            renderBlock ? renderBlock(subBlock, idx, depth + 1) : (
                                <ContentRenderer key={idx} content={subBlock} {...props} />
                            )
                        )
                    ) : (
                        <ContentRenderer content={content} {...props} />
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(SubsectionBlock);