import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const FormulaBlock = ({ block, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${block.title}\n\n${block.code}${block.description ? `\n\n${block.description}` : ''}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Detect if it's LaTeX or plain formula
    const isLatex = block.code?.includes('\\') || block.latex === true;

    return (
        <div className="formula-block card my-4">
            <div className="card-header bg-primary bg-opacity-10 border-primary">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-calculator text-primary me-2"></i>
                        <h5 className="card-title mb-0 text-dark">{block.title}</h5>
                    </div>
                    <div className="formula-actions">
                        <button className="btn btn-sm btn-outline-secondary" onClick={handleCopy}>
                            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                            {copied ? ' Copied!' : ' Copy'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="formula-content">
                    <div className="formula-main d-flex align-items-start">
                        <div className="formula-icon me-3"><i className="fas fa-equals text-muted fa-lg mt-1"></i></div>
                        <div className="formula-text flex-grow-1">
                            <div className="formula-code lead p-3 bg-light rounded font-monospace">
                                {isLatex ? (
                                    block.inline ? <InlineMath math={block.code} /> : <BlockMath math={block.code} />
                                ) : (
                                    <code>{block.code}</code>
                                )}
                            </div>
                            {block.description && (
                                <div className="formula-description mt-3"><div className="description-text text-muted"><i className="fas fa-info-circle me-2"></i>{block.description}</div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FormulaBlock);