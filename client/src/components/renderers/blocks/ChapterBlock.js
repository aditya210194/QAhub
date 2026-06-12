// src/components/renderers/blocks/ChapterBlock.js
import React, { useState } from 'react';
import ContentRenderer from '../ContentRenderer';

const ChapterBlock = ({ block, index, ...props }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const {
        title,
        content,
        chapterNumber,
        summary,
        objectives,
        keyTerms,
        exercises,
        collapsible = false,
        variant = 'default'
    } = block;

    const variantStyles = {
        default: { headerBg: 'bg-primary', border: 'border-primary' },
        highlight: { headerBg: 'bg-warning', border: 'border-warning' },
        info: { headerBg: 'bg-info', border: 'border-info' },
    };

    const style = variantStyles[variant] || variantStyles.default;

    return (
        <div className={`chapter-block card my-5 border ${style.border}`}>
            <div className={`card-header ${style.headerBg} text-white d-flex justify-content-between align-items-center`}>
                <div>
                    {chapterNumber && (
                        <span className="badge bg-light text-dark me-2">Chapter {chapterNumber}</span>
                    )}
                    <h3 className="mb-0 d-inline-block">{title}</h3>
                </div>
                {collapsible && (
                    <button
                        className="btn btn-sm btn-light"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
                    </button>
                )}
            </div>

            {!isCollapsed && (
                <div className="card-body">
                    {/* Learning Objectives */}
                    {objectives && objectives.length > 0 && (
                        <div className="chapter-objectives mb-4 p-3 bg-info bg-opacity-10 rounded">
                            <h5><i className="fas fa-bullseye me-2"></i>Learning Objectives</h5>
                            <ul className="mb-0">
                                {objectives.map((obj, idx) => (
                                    <li key={idx}>{obj}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="chapter-content">
                        <ContentRenderer content={content} {...props} />
                    </div>

                    {/* Key Terms */}
                    {keyTerms && keyTerms.length > 0 && (
                        <div className="chapter-keyterms mt-4 p-3 bg-light rounded">
                            <h5><i className="fas fa-graduation-cap me-2"></i>Key Terms</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {keyTerms.map((term, idx) => (
                                    <span key={idx} className="badge bg-secondary">
                                        {term}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Exercises */}
                    {exercises && exercises.length > 0 && (
                        <div className="chapter-exercises mt-4 p-3 bg-warning bg-opacity-10 rounded">
                            <h5><i className="fas fa-pencil-alt me-2"></i>Practice Exercises</h5>
                            <ol className="mb-0">
                                {exercises.map((exercise, idx) => (
                                    <li key={idx}>{exercise}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Chapter Summary */}
                    {summary && (
                        <div className="chapter-summary mt-4 p-3 bg-success bg-opacity-10 rounded">
                            <h5><i className="fas fa-check-circle me-2"></i>Chapter Summary</h5>
                            <p className="mb-0">{summary}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Progress indicator */}
            <div className="card-footer bg-transparent">
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        {chapterNumber && `Chapter ${chapterNumber}`}
                    </small>
                    {collapsible && !isCollapsed && (
                        <button
                            className="btn btn-sm btn-link"
                            onClick={() => setIsCollapsed(true)}
                        >
                            Collapse <i className="fas fa-chevron-up ms-1"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ChapterBlock);