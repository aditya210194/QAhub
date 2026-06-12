// src/components/renderers/blocks/DecisionTreeBlock.js
import React, { useState } from 'react';

const DecisionTreeBlock = ({ block, index }) => {
    const [currentNode, setCurrentNode] = useState(null);
    const [history, setHistory] = useState([]);
    const [showResult, setShowResult] = useState(false);

    const { title, nodes, startNodeId, interactive = true } = block;

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>🌳 Decision Tree</strong>
                <div className="mt-1 text-muted small">No decision tree data available.</div>
            </div>
        );
    }

    const startNode = nodes.find(n => n.id === startNodeId) || nodes[0];
    const activeNode = currentNode !== null ? nodes.find(n => n.id === currentNode) : startNode;

    const handleChoice = (choice, nextNodeId) => {
        if (!interactive) return;
        setHistory(prev => [...prev, { nodeId: activeNode?.id, choice }]);
        setCurrentNode(nextNodeId);
        if (!nextNodeId) {
            setShowResult(true);
        }
    };

    const handleReset = () => {
        setCurrentNode(null);
        setHistory([]);
        setShowResult(false);
    };

    const handleBack = () => {
        if (history.length > 0) {
            const newHistory = [...history];
            newHistory.pop();
            setHistory(newHistory);
            const prevNode = newHistory.length > 0 ? newHistory[newHistory.length - 1].nodeId : null;
            setCurrentNode(prevNode);
            setShowResult(false);
        }
    };

    if (showResult || (!activeNode?.choices && activeNode?.result)) {
        return (
            <div className="decision-tree-block my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="decision-tree-result p-4 bg-success bg-opacity-10 rounded border border-success">
                    <div className="text-center">
                        <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
                        <h5 className="text-success">Decision Result</h5>
                        <p className="mb-3">{activeNode?.result || 'Thank you for using the decision tree.'}</p>
                        {interactive && (
                            <button className="btn btn-primary" onClick={handleReset}>
                                <i className="fas fa-redo me-2"></i>Start Over
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="decision-tree-block my-4">
            {title && <h4 className="mb-3">{title}</h4>}

            {/* Progress indicator */}
            {history.length > 0 && interactive && (
                <div className="decision-progress mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Step {history.length + 1} of {nodes.length}
                        </small>
                        <button className="btn btn-sm btn-outline-secondary" onClick={handleBack}>
                            <i className="fas fa-arrow-left me-1"></i> Back
                        </button>
                    </div>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                        <div
                            className="progress-bar bg-primary"
                            style={{ width: `${((history.length + 1) / nodes.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Current question */}
            <div className="decision-tree-question p-4 bg-primary bg-opacity-10 rounded border border-primary">
                <div className="text-center mb-4">
                    <i className="fas fa-question-circle text-primary fa-3x mb-2"></i>
                    <h5 className="mb-0">{activeNode?.question || activeNode?.title}</h5>
                    {activeNode?.description && (
                        <p className="text-muted small mt-2">{activeNode.description}</p>
                    )}
                </div>

                {/* Choices */}
                {activeNode?.choices && activeNode.choices.length > 0 && (
                    <div className="decision-choices">
                        <div className="row g-3">
                            {activeNode.choices.map((choice, idx) => (
                                <div key={idx} className="col-md-6">
                                    <button
                                        className="btn btn-outline-primary w-100 text-start p-3"
                                        onClick={() => handleChoice(choice.text, choice.nextNodeId)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="choice-number me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <div className="flex-grow-1">
                                                <strong>{choice.text}</strong>
                                                {choice.description && (
                                                    <div className="small text-muted">{choice.description}</div>
                                                )}
                                            </div>
                                            <i className="fas fa-arrow-right text-primary"></i>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* History summary */}
            {history.length > 0 && (
                <div className="decision-history mt-3 p-2 bg-light rounded small">
                    <strong>Your path:</strong>
                    <ul className="mb-0 mt-1">
                        {history.map((item, idx) => (
                            <li key={idx} className="d-inline me-2">
                                {item.choice} {idx < history.length - 1 && '→'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default React.memo(DecisionTreeBlock);