// src/components/renderers/blocks/DiagramVisualBlock.js
import React, { useState } from 'react';

const DiagramVisualBlock = ({ block, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState(null);

    // Safely extract values
    let title = '';
    let description = '';
    let imageUrl = '';
    let diagramType = 'default';
    let content = [];
    let layers = [];
    let components = [];
    let caption = '';
    let interactive = false;

    if (typeof block === 'object') {
        title = block.title || '';
        description = block.description || '';
        imageUrl = block.image || block.url || '';
        diagramType = block.diagramType || block.type || 'default';
        content = Array.isArray(block.content) ? block.content : (block.content ? [block.content] : []);
        layers = Array.isArray(block.layers) ? block.layers : [];
        components = Array.isArray(block.components) ? block.components : [];
        caption = block.caption || '';
        interactive = block.interactive || false;
    }

    // Handle ASCII/Text diagram (like your Usage Tracking Pipeline)
    if (content.length > 0 && typeof content[0] === 'string' && content[0].includes('═') || content[0].includes('─') || content[0].includes('┌')) {
        return (
            <div className="diagram-visual-ascii my-4">
                {title && <h4 className="mb-3 text-center">{title}</h4>}
                {description && <p className="text-center text-muted mb-3">{description}</p>}
                <div className="ascii-diagram-wrapper p-3 bg-dark text-light rounded" style={{ overflowX: 'auto' }}>
                    <pre className="ascii-art mb-0" style={{
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        lineHeight: '1.4',
                        color: '#00ff88',
                        background: '#0a0e27',
                        padding: '16px',
                        borderRadius: '8px',
                        overflowX: 'auto'
                    }}>
                        {content.map((line, idx) => (
                            <div key={idx} className="ascii-line" style={{ whiteSpace: 'pre' }}>
                                {line}
                            </div>
                        ))}
                    </pre>
                </div>
                {caption && <div className="text-center text-muted small mt-3">{caption}</div>}

                {/* Expand button for large diagrams */}
                {content.length > 20 && (
                    <div className="text-center mt-2">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} me-1`}></i>
                            {isExpanded ? 'Show Less' : 'Show Full Diagram'}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Architecture Diagram
    if ((diagramType === 'architecture' || diagramType === 'visual') && layers.length > 0) {
        return (
            <div className="diagram-visual-architecture my-4">
                {title && <h4 className="mb-3 text-center">{title}</h4>}
                {description && <p className="text-center text-muted mb-4">{description}</p>}

                <div className="architecture-diagram">
                    {layers.map((layer, idx) => (
                        <div key={idx} className={`architecture-layer layer-${idx + 1} mb-3`}>
                            <div className="layer-header bg-primary text-white p-2 rounded-top">
                                <h6 className="mb-0 text-center">{layer.name || layer.layer}</h6>
                            </div>
                            <div className="layer-content p-3 border rounded-bottom bg-light">
                                <div className="row g-2">
                                    {(layer.components || layer.items || []).map((component, compIdx) => (
                                        <div key={compIdx} className="col-md-4 col-sm-6">
                                            <div
                                                className={`component-card p-2 text-center rounded ${interactive ? 'cursor-pointer hover-shadow' : ''}`}
                                                onClick={() => interactive && setSelectedLayer(selectedLayer === compIdx ? null : compIdx)}
                                            >
                                                <i className={`fas ${component.icon || 'fa-cube'} fa-2x text-primary mb-1`}></i>
                                                <div className="small fw-bold">{component.name}</div>
                                                {interactive && selectedLayer === compIdx && component.description && (
                                                    <div className="component-desc mt-1 small text-muted">
                                                        {component.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {caption && <div className="text-center text-muted small mt-3">{caption}</div>}
            </div>
        );
    }

    // Flowchart Diagram
    if (diagramType === 'flowchart' && components.length > 0) {
        return (
            <div className="diagram-visual-flowchart my-4">
                {title && <h4 className="mb-3 text-center">{title}</h4>}
                {description && <p className="text-center text-muted mb-4">{description}</p>}

                <div className="flowchart-diagram d-flex flex-column align-items-center">
                    {components.map((component, idx) => (
                        <div key={idx} className="flowchart-node text-center mb-3" style={{ width: '100%', maxWidth: '300px' }}>
                            <div className={`node-box p-3 rounded shadow-sm ${component.type === 'start' ? 'bg-success text-white' : component.type === 'end' ? 'bg-danger text-white' : component.type === 'decision' ? 'bg-warning' : 'bg-primary text-white'}`}>
                                <i className={`fas ${component.icon || 'fa-circle'} me-2`}></i>
                                <strong>{component.label || component.name}</strong>
                            </div>
                            {idx < components.length - 1 && (
                                <div className="node-arrow my-2">
                                    <i className="fas fa-arrow-down text-muted"></i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {caption && <div className="text-center text-muted small mt-3">{caption}</div>}
            </div>
        );
    }

    // Component Diagram
    if (diagramType === 'components' && components.length > 0) {
        return (
            <div className="diagram-visual-components my-4">
                {title && <h4 className="mb-3 text-center">{title}</h4>}
                {description && <p className="text-center text-muted mb-4">{description}</p>}

                <div className="components-diagram">
                    <div className="row g-4 justify-content-center">
                        {components.map((component, idx) => (
                            <div key={idx} className="col-md-4 col-sm-6">
                                <div
                                    className={`component-card text-center p-3 border rounded shadow-sm h-100 ${interactive ? 'cursor-pointer' : ''}`}
                                    onClick={() => interactive && setSelectedLayer(selectedLayer === idx ? null : idx)}
                                >
                                    <div className="component-icon mb-2">
                                        <i className={`fas ${component.icon || 'fa-puzzle-piece'} fa-3x text-primary`}></i>
                                    </div>
                                    <h6 className="fw-bold">{component.name}</h6>
                                    <p className="small text-muted mb-0">{component.description}</p>
                                    {interactive && selectedLayer === idx && component.details && (
                                        <div className="component-details mt-2 p-2 bg-light rounded small">
                                            {component.details}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {caption && <div className="text-center text-muted small mt-3">{caption}</div>}
            </div>
        );
    }

    // Simple Image Diagram
    if (imageUrl) {
        return (
            <div className="diagram-visual-image my-4 text-center">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="diagram-image-container">
                    <img
                        src={imageUrl}
                        alt={title || 'Diagram'}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '500px', cursor: 'pointer' }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        loading="lazy"
                    />
                    {isExpanded && (
                        <div className="diagram-fullscreen-overlay" onClick={() => setIsExpanded(false)}>
                            <img src={imageUrl} alt={title || 'Diagram'} className="img-fluid" />
                        </div>
                    )}
                </div>
                {description && <p className="text-muted mt-2">{description}</p>}
                {caption && <div className="text-muted small mt-1">{caption}</div>}
            </div>
        );
    }

    // Fallback for other diagram types
    return (
        <div className="diagram-visual-fallback my-4 p-4 bg-light rounded text-center">
            <i className="fas fa-chart-simple fa-3x text-muted mb-3"></i>
            <h5>{title || 'Diagram'}</h5>
            {description && <p className="text-muted small">{description}</p>}
            {caption && <div className="text-muted small mt-2">{caption}</div>}
            {content.length > 0 && (
                <div className="mt-3 p-3 bg-dark text-light rounded" style={{ overflowX: 'auto' }}>
                    <pre className="mb-0" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {Array.isArray(content) ? content.join('\n') : content}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default React.memo(DiagramVisualBlock);