import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DefinitionBlock = ({ block, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(block.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleExpand = () => setExpanded(!expanded);

    const getDefinitionType = () => {
        const typeMap = {
            'formal': { icon: 'fas fa-gavel', color: 'primary', label: 'Formal Definition' },
            'technical': { icon: 'fas fa-cogs', color: 'info', label: 'Technical Definition' },
            'conceptual': { icon: 'fas fa-lightbulb', color: 'warning', label: 'Conceptual Definition' },
            'operational': { icon: 'fas fa-play-circle', color: 'success', label: 'Operational Definition' },
            'standard': { icon: 'fas fa-certificate', color: 'secondary', label: 'Standard Definition' }
        };
        return typeMap[block.definitionType] || { icon: 'fas fa-book', color: 'dark', label: 'Definition' };
    };

    const definitionType = getDefinitionType();

    return (
        <div className="definition-block card my-4">
            <div className={`card-header bg-${definitionType.color} bg-opacity-10 border-${definitionType.color}`}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <i className={`${definitionType.icon} text-${definitionType.color} me-2`}></i>
                        <h5 className="card-title mb-0 text-dark">
                            {block.title || definitionType.label}
                        </h5>
                    </div>
                    <div className="definition-actions">
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={handleCopy} title="Copy definition">
                            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                            {copied ? ' Copied!' : ' Copy'}
                        </button>
                        {(block.details || block.examples || block.relatedTerms) && (
                            <button className="btn btn-sm btn-outline-primary" onClick={toggleExpand}>
                                <i className={`fas fa-${expanded ? 'minus' : 'plus'}`}></i>
                                {expanded ? ' Less' : ' More'}
                            </button>
                        )}
                    </div>
                </div>
                {(block.source || block.domain || block.lastUpdated) && (
                    <div className="definition-meta mt-2 small">
                        {block.source && <span className="me-3"><i className="fas fa-source me-1"></i>Source: {block.source}</span>}
                        {block.domain && <span className="me-3"><i className="fas fa-tag me-1"></i>Domain: {block.domain}</span>}
                        {block.lastUpdated && <span><i className="fas fa-calendar me-1"></i>Updated: {block.lastUpdated}</span>}
                    </div>
                )}
            </div>
            <div className="card-body">
                <div className="definition-content">
                    <div className="definition-text lead">
                        <i className="fas fa-quote-left text-muted me-2"></i>
                        {block.content}
                        <i className="fas fa-quote-right text-muted ms-2"></i>
                    </div>
                    {block.keyPoints && (
                        <div className="key-points mt-3">
                            <h6 className="text-muted mb-2"><i className="fas fa-key me-2"></i>Key Points:</h6>
                            <ul className="list-unstyled">
                                {block.keyPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="mb-1"><i className="fas fa-circle text-primary me-2 small"></i>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {expanded && (
                    <div className="expanded-content mt-4">
                        {block.details && (
                            <div className="definition-details mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-info-circle me-2 text-info"></i>Detailed Explanation</h6>
                                <div className="details-content mt-2">
                                    {typeof block.details === 'string' ? <p>{block.details}</p> : block.details.map((detail, i) => <p key={i}>{detail}</p>)}
                                </div>
                            </div>
                        )}
                        {block.examples && (
                            <div className="definition-examples mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-list-alt me-2 text-success"></i>Examples</h6>
                                <div className="examples-content mt-2">
                                    {block.examples.map((example, i) => (
                                        <div key={i} className="example-item mb-3 p-3 bg-light rounded">
                                            {example.title && <strong className="d-block mb-1">{example.title}:</strong>}
                                            <div>{example.content}</div>
                                            {example.context && <small className="text-muted mt-1 d-block">Context: {example.context}</small>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {block.relatedTerms && (
                            <div className="related-terms mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-link me-2 text-warning"></i>Related Terms</h6>
                                <div className="terms-list mt-2">
                                    {block.relatedTerms.map((term, i) => <span key={i} className="badge bg-light text-dark border me-2 mb-2">{term}</span>)}
                                </div>
                            </div>
                        )}
                        {block.formula && (
                            <div className="definition-formula mb-4">
                                <h6 className="border-bottom pb-2"><i className="fas fa-calculator me-2 text-danger"></i>Formula</h6>
                                <div className="formula-content mt-2 p-3 bg-dark text-light rounded"><code>{block.formula}</code></div>
                                {block.formulaExplanation && <small className="text-muted mt-1 d-block">{block.formulaExplanation}</small>}
                            </div>
                        )}
                        {block.bestPractices && (
                            <div className="best-practices">
                                <h6 className="border-bottom pb-2"><i className="fas fa-check-circle me-2 text-success"></i>Best Practices</h6>
                                <ul className="list-group list-group-flush mt-2">
                                    {block.bestPractices.map((practice, i) => <li key={i} className="list-group-item d-flex align-items-start"><i className="fas fa-check text-success me-2 mt-1"></i><span>{practice}</span></li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                <div className="definition-footer mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="definition-tags">{block.tags?.map((tag, i) => <span key={i} className="badge bg-secondary me-1">{tag}</span>)}</div>
                        <div className="quick-actions">
                            {block.referenceLink && <a href={block.referenceLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info me-2"><i className="fas fa-external-link-alt me-1"></i>Reference</a>}
                            <small className="text-muted"><i className="fas fa-eye me-1"></i>Definition</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DefinitionBlock);