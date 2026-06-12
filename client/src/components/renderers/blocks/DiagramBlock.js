// src/components/renderers/blocks/DiagramBlock.js
import React, { useState } from 'react';

const DiagramBlock = ({ block, index }) => {
    const [activeNode, setActiveNode] = useState(null);
    const { title, diagramType, nodes, connections, image, caption, interactive = false } = block;

    if (image) {
        return (
            <div className="diagram-block my-4 text-center">
                {title && <h5 className="mb-3">{title}</h5>}
                <img src={image} alt={title || 'Diagram'} className="img-fluid rounded shadow-sm" loading="lazy" />
                {caption && <div className="text-muted small mt-2">{caption}</div>}
            </div>
        );
    }

    if (diagramType === 'flowchart' && nodes) {
        return (
            <div className="flowchart-diagram my-4">
                {title && <h5 className="mb-3 text-center">{title}</h5>}
                <div className="flowchart-container d-flex flex-column align-items-center">
                    {nodes.map((node, idx) => (
                        <div key={idx} className="flowchart-node text-center mb-3">
                            <div className={`node-box p-3 rounded shadow-sm ${node.type === 'start' ? 'bg-success text-white' : node.type === 'end' ? 'bg-danger text-white' : node.type === 'decision' ? 'bg-warning' : 'bg-primary text-white'}`}
                                 style={{ minWidth: '200px', cursor: interactive ? 'pointer' : 'default' }}
                                 onClick={() => interactive && setActiveNode(activeNode === idx ? null : idx)}
                            >
                                <strong>{node.label}</strong>
                                {activeNode === idx && node.description && (
                                    <div className="node-description mt-2 p-2 bg-white text-dark rounded small">
                                        {node.description}
                                    </div>
                                )}
                            </div>
                            {idx < nodes.length - 1 && (
                                <div className="node-arrow my-2">
                                    <i className="fas fa-arrow-down text-muted"></i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (diagramType === 'mindmap' && nodes) {
        return (
            <div className="mindmap-diagram my-4">
                {title && <h5 className="mb-3 text-center">{title}</h5>}
                <div className="mindmap-container text-center">
                    <div className="central-node mb-4">
                        <div className="d-inline-block p-3 bg-primary text-white rounded-circle shadow">
                            <strong>{nodes[0]?.label || 'Central Idea'}</strong>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {nodes.slice(1).map((node, idx) => (
                            <div key={idx} className="col-md-3 mb-3">
                                <div className="branch-node p-2 border rounded shadow-sm bg-light">
                                    <i className="fas fa-arrow-right text-primary me-1"></i>
                                    <strong>{node.label}</strong>
                                    {node.children && (
                                        <ul className="mt-2 mb-0 small text-start">
                                            {node.children.map((child, childIdx) => (
                                                <li key={childIdx}>{child}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="diagram-block my-4 p-3 bg-light rounded text-center">
            {title && <h5 className="mb-3">{title}</h5>}
            <pre className="text-muted mb-0" style={{ fontFamily: 'monospace' }}>
                {block.ascii || '[Diagram representation would appear here]'}
            </pre>
            {caption && <div className="text-muted small mt-2">{caption}</div>}
        </div>
    );
};

export default React.memo(DiagramBlock);