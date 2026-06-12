// src/components/renderers/blocks/SectionBlock.js
import React from 'react';
import ContentRenderer from '../ContentRenderer';

const SectionBlock = ({ block, index, renderBlock, ...props }) => {
    const { title, content, icon, variant, background } = block;

    // Styles for different variants
    const variantStyles = {
        default: { backgroundColor: 'transparent', border: 'none' },
        highlighted: { backgroundColor: '#f8f9fa', borderLeft: '4px solid #0d6efd', padding: '1rem' },
        card: { backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
        warning: { backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '1rem' },
        info: { backgroundColor: '#d1ecf1', borderLeft: '4px solid #17a2b8', padding: '1rem' },
        danger: { backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545', padding: '1rem' },
        success: { backgroundColor: '#d4edda', borderLeft: '4px solid #28a745', padding: '1rem' },
    };

    const style = variantStyles[variant] || variantStyles.default;

    // Custom background if provided
    if (background) {
        style.backgroundColor = background;
    }

    return (
        <section className={`section-block my-4 ${variant ? `section-${variant}` : ''}`} style={style}>
            {title && (
                <div className="section-header mb-3">
                    {icon && <i className={`${icon} me-2 text-primary`}></i>}
                    <h3 className={`section-title ${variant === 'card' ? 'h5' : 'h4'} mb-0 d-inline-block`}>
                        {title}
                    </h3>
                    {variant === 'card' && <hr className="mt-2 mb-3" />}
                </div>
            )}
            <div className="section-content">
                {typeof content === 'string' ? (
                    <ContentRenderer content={content} {...props} />
                ) : Array.isArray(content) ? (
                    content.map((subBlock, idx) => renderBlock ? renderBlock(subBlock, idx) : (
                        <ContentRenderer key={idx} content={subBlock} {...props} />
                    ))
                ) : (
                    <ContentRenderer content={content} {...props} />
                )}
            </div>
        </section>
    );
};

export default React.memo(SectionBlock);