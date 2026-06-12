// src/components/renderers/blocks/DefinitionBoxBlock.js
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DefinitionBoxBlock = ({ block, index }) => {
    const [copied, setCopied] = useState(false);

    // Safely extract values
    let title = '';
    let definition = '';
    let example = '';
    let note = '';
    let variant = 'default';

    if (typeof block === 'object') {
        title = block.title || block.term || '';
        definition = block.definition || block.content || '';
        example = block.example || '';
        note = block.note || '';
        variant = block.variant || 'default';
    }

    if (!title && !definition) {
        return (
            <div className="alert alert-info my-2 p-2">
                <strong>📖 Definition Box</strong>
                <div className="mt-1 text-muted small">No definition content available.</div>
            </div>
        );
    }

    const variantStyles = {
        default: { border: 'border-primary', headerBg: 'bg-primary', icon: 'fa-book' },
        important: { border: 'border-danger', headerBg: 'bg-danger', icon: 'fa-exclamation-triangle' },
        tip: { border: 'border-success', headerBg: 'bg-success', icon: 'fa-lightbulb' },
        warning: { border: 'border-warning', headerBg: 'bg-warning', icon: 'fa-exclamation-circle' },
    };

    const style = variantStyles[variant] || variantStyles.default;

    const handleCopy = () => {
        if (definition) {
            navigator.clipboard.writeText(definition);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`definition-box card my-4 border ${style.border} shadow-sm`}>
            <div className={`card-header ${style.headerBg} text-white d-flex justify-content-between align-items-center`}>
                <div className="d-flex align-items-center">
                    <i className={`fas ${style.icon} me-2`}></i>
                    <h5 className="mb-0">{title || 'Definition'}</h5>
                </div>
                <button className="btn btn-sm btn-light" onClick={handleCopy}>
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} me-1`}></i>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="card-body">
                <div className="definition-content">
                    <p className="lead mb-3">{definition}</p>
                    {example && (
                        <div className="example-box mt-3 p-3 bg-light rounded">
                            <strong className="text-primary"><i className="fas fa-code me-1"></i>Example:</strong>
                            <p className="mb-0 mt-1">{example}</p>
                        </div>
                    )}
                    {note && (
                        <div className="note-box mt-3 p-2 bg-info bg-opacity-10 rounded small">
                            <i className="fas fa-info-circle text-info me-1"></i>
                            <strong>Note:</strong> {note}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(DefinitionBoxBlock);