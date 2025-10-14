import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from 'react-mermaid2';
import ChartRenderer from './ChartRenderer';
import PropTypes from 'prop-types';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';

// Enhanced error boundary with recovery option
class ContentErrorBoundary extends React.Component {
    state = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Content rendering error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        this.props.onRetry?.();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="alert alert-danger my-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Error rendering content:</strong> {this.state.error?.message}
                            {this.props.fallback && (
                                <div className="mt-2">
                                    {this.props.fallback}
                                </div>
                            )}
                        </div>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={this.handleRetry}
                        >
                            Retry
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                        <details className="mt-2 small">
                            <summary>Error details</summary>
                            <pre>{this.state.errorInfo.componentStack}</pre>
                        </details>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}
const InteractiveQuiz = ({ block, index }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    return (
        <div key={index} className="interactive-quiz card my-4">
            <div className="card-body">
                <h3 className="card-title">{block.title}</h3>
                <p className="quiz-question fw-bold">{block.question}</p>

                <div className="quiz-options">
                    {block.options?.map((option, i) => (
                        <div key={i} className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                name={`quiz-${index}`}
                                id={`option-${index}-${i}`}
                                checked={selectedAnswer === i}
                                onChange={() => setSelectedAnswer(i)}
                                disabled={showExplanation}
                            />
                            <label className="form-check-label" htmlFor={`option-${index}-${i}`}>
                                {option}
                            </label>
                        </div>
                    ))}
                </div>

                {!showExplanation && (
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => setShowExplanation(true)}
                        disabled={selectedAnswer === null}
                    >
                        Check Answer
                    </button>
                )}

                {showExplanation && (
                    <div className={`quiz-explanation mt-3 alert ${
                        selectedAnswer === block.correctAnswer ? 'alert-success' : 'alert-danger'
                    }`}>
                        <strong>
                            {selectedAnswer === block.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                        </strong>
                        <p className="mb-0 mt-2">{block.explanation}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
const ContentRenderer = ({
                             content,
                             contentType = 'markdown',
                             baseUrl = '',
                             imageWrapperClass = 'text-center my-4',
                             imageClass = 'img-fluid rounded',
                             maxImageHeight = '400px',
                             fallbackImage = `${process.env.PUBLIC_URL}/fallback-image.png`,
                             theme = 'light',
                             interactive = true,
                             onContentRendered
                         }) => {
    const [collapsedSubsections, setCollapsedSubsections] = useState([]);
    const [collapsedSections, setCollapsedSections] = useState([]);
    const [copiedItems, setCopiedItems] = useState({});
    const [activeTabs, setActiveTabs] = useState({});
    const [flashcardStates, setFlashcardStates] = useState({});
    const [activeArea, setActiveArea] = useState(null);
    const [calculatorValues, setCalculatorValues] = useState({});
    const [calculatorResults, setCalculatorResults] = useState({});
    const [currentMetric, setCurrentMetric] = useState(null);
    const [showMetricModal, setShowMetricModal] = useState(false);
    const [retryKeys, setRetryKeys] = useState({});

    // Generate unique content key for error boundary recovery
    const contentKey = useMemo(() => {
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) return JSON.stringify(content);
        return uuidv4();
    }, [content]);

    // Notify parent when content is rendered
    useEffect(() => {
        if (onContentRendered) {
            onContentRendered();
        }
    }, [contentKey, onContentRendered]);

    const handleRetryBlock = useCallback((blockId) => {
        setRetryKeys(prev => ({ ...prev, [blockId]: uuidv4() }));
    }, []);

    const isCollapsed = useCallback(
        (index) => collapsedSubsections.includes(index),
        [collapsedSubsections]
    );

    const getDifficultyColor = (difficulty) => {
        const difficultyMap = {
            'beginner': 'success',
            'intermediate': 'warning',
            'advanced': 'danger',
            'expert': 'dark',
            'easy': 'success',
            'medium': 'warning',
            'hard': 'danger'
        };
        return difficultyMap[difficulty.toLowerCase()] || 'primary';
    };

    const getTrendColor = (trend) => {
        const trendMap = {
            'up': 'success',
            'down': 'danger',
            'neutral': 'secondary'
        };
        return trendMap[trend] || 'secondary';
    };

    const showMetricDetails = useCallback((metric) => {
        setCurrentMetric(metric);
        setShowMetricModal(true);
    }, []);

    const toggleCollapse = useCallback(
        (index) => {
            setCollapsedSubsections((prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        },
        []
    );

    const toggleSection = useCallback((sectionIndex) => {
        setCollapsedSections((prev) =>
            prev.includes(sectionIndex)
                ? prev.filter((i) => i !== sectionIndex)
                : [...prev, sectionIndex]
        );
    }, []);

    const isSectionCollapsed = useCallback(
        (sectionIndex) => collapsedSections.includes(sectionIndex),
        [collapsedSections]
    );

    const handleCopy = useCallback((id) => {
        setCopiedItems((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setCopiedItems((prev) => ({ ...prev, [id]: false }));
        }, 2000);
    }, []);

    const handleTabChange = useCallback((blockIndex, tabIndex) => {
        setActiveTabs((prev) => ({
            ...prev,
            [blockIndex]: tabIndex
        }));
    }, []);

    const toggleFlashcard = useCallback((blockIndex) => {
        setFlashcardStates((prev) => ({
            ...prev,
            [blockIndex]: !prev[blockIndex]
        }));
    }, []);

    const handleAreaClick = useCallback((area) => {
        if (area.action === 'link' && area.link) {
            window.open(area.link, '_blank');
        }
        // Add other action types as needed
    }, []);

    const handleCalcInput = useCallback((blockIndex, fieldIndex, value) => {
        setCalculatorValues((prev) => ({
            ...prev,
            [`${blockIndex}-${fieldIndex}`]: value
        }));
    }, []);

    const handleCalculate = useCallback((blockIndex, formula) => {
        // Simple calculation example - replace with real parser
        const values = Object.entries(calculatorValues)
            .filter(([key]) => key.startsWith(`${blockIndex}-`))
            .map(([, value]) => parseFloat(value) || 0);

        if (formula === 'sum') {
            const result = values.reduce((acc, val) => acc + val, 0);
            setCalculatorResults((prev) => ({
                ...prev,
                [blockIndex]: result.toFixed(2)
            }));
        } else {
            setCalculatorResults((prev) => ({
                ...prev,
                [blockIndex]: "Calculation not implemented"
            }));
        }
    }, [calculatorValues]);

    const getStatusBadgeClass = useCallback((status) => {
        const statusMap = {
            new: 'badge-status-new',
            updated: 'badge-status-updated',
            deprecated: 'badge-status-deprecated',
            experimental: 'badge-status-experimental'
        };
        return statusMap[status] || 'bg-secondary';
    }, []);

    const ImageRenderer = React.memo(({ src, alt, title }) => {
        const [imageSrc, setImageSrc] = useState(
            src.startsWith('http') ? src : `${baseUrl}${src}`
        );
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);

        const handleError = useCallback(() => {
            if (!error) {
                setError(true);
                if (imageSrc !== fallbackImage) {
                    setImageSrc(fallbackImage);
                }
            }
        }, [error, imageSrc, fallbackImage]);

        const handleLoad = useCallback(() => {
            setLoading(false);
        }, []);

        return (
            <figure className={`${imageWrapperClass} ${loading ? 'loading' : ''}`}>
                <div className="image-container position-relative">
                    {loading && (
                        <div className="image-loader">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <img
                        src={imageSrc}
                        alt={alt || ''}
                        className={`${imageClass} ${error ? 'image-error' : ''}`}
                        style={{ maxHeight: maxImageHeight }}
                        loading="lazy"
                        onError={handleError}
                        onLoad={handleLoad}
                    />
                    {interactive && (
                        <div className="image-overlay">
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => window.open(imageSrc, '_blank')}
                            >
                                <i className="fas fa-expand"></i>
                            </button>
                        </div>
                    )}
                </div>
                {title && <figcaption className="mt-2 text-muted">{title}</figcaption>}
            </figure>
        );
    });

    const markdownComponents = useMemo(() => ({
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const id = uuidv4();

            return !inline && match ? (
                <div className="code-block-wrapper">
                    <div className="code-header d-flex justify-content-between align-items-center">
                        <div className="language-tag">{match[1]}</div>
                        <CopyToClipboard text={String(children).replace(/\n$/, '')} onCopy={() => handleCopy(id)}>
                            <button className="copy-button btn btn-sm btn-outline-secondary">
                                {copiedItems[id] ? (
                                    <><i className="fas fa-check me-1"></i> Copied!</>
                                ) : (
                                    <><i className="fas fa-copy me-1"></i> Copy</>
                                )}
                            </button>
                        </CopyToClipboard>
                    </div>
                    <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        table({ children }) {
            return (
                <div className="table-responsive my-3">
                    <table className="table table-striped table-bordered">{children}</table>
                </div>
            );
        },
        img: ImageRenderer,
        math: ({ inline, children }) =>
            inline ? (
                <InlineMath math={children[0]} />
            ) : (
                <div className="math-block">
                    <BlockMath math={children[0]} />
                </div>
            ),
    }), [handleCopy, copiedItems, baseUrl, fallbackImage, interactive]);

    const renderContent = (content) => (
        <ContentRenderer
            content={content}
            baseUrl={baseUrl}
            imageWrapperClass={imageWrapperClass}
            imageClass={imageClass}
            maxImageHeight={maxImageHeight}
            fallbackImage={fallbackImage}
            theme={theme}
            interactive={interactive}
        />
    );

    const renderBlock = (block, index, depth = 0) => {
        if (!block || !block.type) return null;

        // Generate unique key for error boundary recovery
        const blockKey = `${index}-${retryKeys[index] || '0'}`;

        try {
            switch (block.type) {
                case 'section':
                    return (
                        <section key={index} className="mb-5">
                            {block.title && <h2 className="mb-4">{block.title}</h2>}
                            <ContentRenderer
                                content={block.content}
                                baseUrl={baseUrl}
                                imageWrapperClass={imageWrapperClass}
                                imageClass={imageClass}
                                maxImageHeight={maxImageHeight}
                                fallbackImage={fallbackImage}
                            />
                        </section>
                    );

                case 'text':
                    return (
                        <div key={index} className="text-block mb-4">
                            <ReactMarkdown components={markdownComponents}>
                                {block.value}
                            </ReactMarkdown>
                            {block.subpoints && (
                                <ul className="subpoints mt-3 ps-4">
                                    {block.subpoints.map((point, i) => (
                                        <li key={i}>
                                            <ReactMarkdown components={markdownComponents}>
                                                {point}
                                            </ReactMarkdown>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {block.example && (
                                <div className="example-block bg-light p-3 rounded mt-3">
                                    <strong>{block.example.title}: </strong>
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.example.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    );
                case 'example':
                    return (
                        <div key={index} className="example-block card border-0 shadow-sm my-4">
                            <div className="card-header bg-danger bg-opacity-10 d-flex align-items-center">
                                <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                                <h5 className="mb-0 text-danger">{block.title || 'Real-World Example'}</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {/* Scenario */}
                                    <div className="col-md-4">
                                        <div className="p-3 h-100 border-start border-3 border-danger">
                                            <h6 className="d-flex align-items-center text-danger">
                                                <i className="fas fa-fire me-2"></i>Scenario
                                            </h6>
                                            <ReactMarkdown components={markdownComponents}>
                                                {block.scenario}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Outcome */}
                                    <div className="col-md-4">
                                        <div className="p-3 h-100 border-start border-3 border-warning">
                                            <h6 className="d-flex align-items-center text-warning-dark">
                                                <i className="fas fa-dollar-sign me-2"></i>Outcome
                                            </h6>
                                            <ReactMarkdown components={markdownComponents}>
                                                {block.outcome}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Prevention */}
                                    <div className="col-md-4">
                                        <div className="p-3 h-100 border-start border-3 border-success">
                                            <h6 className="d-flex align-items-center text-success">
                                                <i className="fas fa-shield-alt me-2"></i>Prevention
                                            </h6>
                                            <ReactMarkdown components={markdownComponents}>
                                                {block.prevention}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Details */}
                                {block.details && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <h6 className="d-flex align-items-center">
                                            <i className="fas fa-info-circle me-2"></i>Technical Details
                                        </h6>
                                        <ReactMarkdown components={markdownComponents}>
                                            {block.details}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    );

                case 'image':
                    return (
                        <ImageRenderer
                            key={index}
                            src={block.image}
                            alt={block.caption}
                            title={block.caption}
                        />
                    );

                case 'table':
                    return (
                        <div key={index} className="table-responsive my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <table className="table table-bordered">
                                {block.columns && (
                                    <thead>
                                    <tr>
                                        {block.columns.map((col, i) => (
                                            <th key={i}>{col}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                )}
                                <tbody>
                                {block.rows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j}>
                                                <ReactMarkdown components={markdownComponents}>
                                                    {cell}
                                                </ReactMarkdown>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {block.footer && (
                                <div className="text-muted small mt-2">{block.footer}</div>
                            )}
                        </div>
                    );

                case 'chart':
                    return (
                        <div key={index} className="chart-container my-4" style={{ height: '400px' }}>
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <ChartRenderer
                                chartType={block.chartType}
                                data={{
                                    labels: block.data.labels,
                                    datasets: [{
                                        label: block.title,
                                        data: block.data.values,
                                        backgroundColor: block.data.colors
                                    }]
                                }}
                            />
                            {block.caption && (
                                <div className="text-muted small mt-2">{block.caption}</div>
                            )}
                        </div>
                    );

                case 'markdown':
                    return (
                        <ReactMarkdown key={index} components={markdownComponents}>
                            {block.data}
                        </ReactMarkdown>
                    );

                case 'definition-list':
                    return (
                        <div key={index} className="definition-list">
                            {block.title && <h4>{block.title}</h4>}
                            <dl>
                                {block.items.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <dt>{item.term}</dt>
                                        <dd>{item.definition}</dd>
                                    </React.Fragment>
                                ))}
                            </dl>
                        </div>
                    );

                case 'list':
                    return (
                        <ul key={index} className="ps-3" style={block.style}>
                            {block.items?.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    );

                case 'code': {
                    // Determine language from file extension if not specified
                    const detectLanguage = (code) => {
                        if (block.language) return block.language;

                        const firstLine = (code || '').split('\n')[0];
                        const extensionMatches = firstLine.match(/\.([a-z0-9]+)$/i);
                        if (extensionMatches) {
                            return extensionMatches[1].toLowerCase();
                        }
                        return 'text';
                    };

                    // Check if content is test case format
                    const isTestCase = (content) => {
                        return content.includes('Test Case ID:') ||
                            content.includes('Steps:') ||
                            content.includes('Expected:');
                    };

                    const codeContent = block.code || block.value || '';
                    const language = detectLanguage(codeContent);
                    const shouldHighlight = !isTestCase(codeContent) && language !== 'text';

                    return (
                        <div key={index} className={`advanced-code-block ${block.variant || 'default'}`}>
                            {/* Header with language tab and actions */}
                            <div className="code-header">
                                <div className="language-tab">
                                    <span className="language-name">{language}</span>
                                    {block.filename && (
                                        <span className="filename">{block.filename}</span>
                                    )}
                                </div>
                                <div className="code-actions">
                                    {block.copyable && (
                                        <button
                                            className="copy-button"
                                            onClick={() => navigator.clipboard.writeText(codeContent)}
                                        >
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="code-content-container">
                                {shouldHighlight ? (
                                    <SyntaxHighlighter
                                        language={language}
                                        style={atomDark}
                                        showLineNumbers={block.showLineNumbers !== false}
                                        wrapLines={true}
                                        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                                    >
                                        {codeContent}
                                    </SyntaxHighlighter>
                                ) : (
                                    <pre className="plain-code">
                    {codeContent.split('\n').map((line, i) => (
                        <div key={i} className="code-line">
                            {block.showLineNumbers !== false && (
                                <span className="line-number">{i + 1}</span>
                            )}
                            <span className="line-content">{line}</span>
                        </div>
                    ))}
                  </pre>
                                )}
                            </div>

                            {/* Footer with metadata */}
                            {(block.caption || block.metadata) && (
                                <div className="code-footer">
                                    {block.caption && <div className="code-caption">{block.caption}</div>}
                                    {block.metadata && (
                                        <div className="code-metadata">
                                            {Object.entries(block.metadata).map(([key, value]) => (
                                                <span key={key} className="meta-item">
                          <strong>{key}:</strong> {value}
                        </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }

                case 'mermaid':
                    return (
                        <div key={index} className="my-4">
                            <Mermaid chart={block.code} />
                        </div>
                    );

                case 'diagram':
                    return (
                        <div key={index} className="diagram-container my-4 p-3 border rounded">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            {block.image && (
                                <figure className="text-center">
                                    <img
                                        src={block.image}
                                        alt={block.caption || block.title}
                                        className="img-fluid"
                                    />
                                    {block.caption && <figcaption className="mt-2 text-muted">{block.caption}</figcaption>}
                                </figure>
                            )}
                            {block.layers && (
                                <div className="mt-3">
                                    <h6>Process Layers:</h6>
                                    <ul className="list-group">
                                        {block.layers.map((layer, i) => (
                                            <li key={i} className="list-group-item">
                                                <strong>{layer.phase}:</strong> {layer.activity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );

                case 'comparison-grid':
                    return (
                        <div key={index} className="comparison-grid my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    {block.columns && (
                                        <thead className="table-light">
                                        <tr>
                                            {block.columns.map((col, i) => (
                                                <th key={i}>{col}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                    {block.rows.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j}>
                                                    <ReactMarkdown components={markdownComponents}>
                                                        {cell}
                                                    </ReactMarkdown>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );

                case 'infographic':
                    return (
                        <div key={index} className="infographic-container my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            {block.image && (
                                <figure className="text-center">
                                    <img
                                        src={block.image}
                                        alt={block.title}
                                        className="img-fluid rounded"
                                    />
                                </figure>
                            )}
                            {block.levels && (
                                <div className="mt-3">
                                    <h6>Breakdown:</h6>
                                    <div className="progress mb-3" style={{ height: '30px' }}>
                                        {block.levels.map((level, i) => (
                                            <div
                                                key={i}
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${level.percentage}%`,
                                                    backgroundColor: level.color
                                                }}
                                                aria-valuenow={level.percentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {level.type} ({level.percentage}%)
                                            </div>
                                        ))}
                                    </div>
                                    {block.bestPractice && (
                                        <div className="alert alert-info mt-2">
                                            <strong>Best Practice:</strong> {block.bestPractice}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );

                case 'myth-busters':
                    return (
                        <div key={index} className="myth-busters my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <div className="row">
                                {block.items.map((item, i) => (
                                    <div key={i} className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            <div className="card-header bg-danger text-white">
                                                <strong>Myth:</strong> {item.myth}
                                            </div>
                                            <div className="card-body bg-light">
                                                <strong>Reality:</strong> {item.reality}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'step-by-step':
                    return (
                        <div key={index} className="step-by-step my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <div className="list-group">
                                {block.steps.map((step, i) => (
                                    <div key={i} className="list-group-item">
                                        <div className="d-flex align-items-start">
                                            <span className="badge bg-primary me-3 mt-1">{step.step}</span>
                                            <div>
                                                <h6 className="mb-1">{step.action}</h6>
                                                {step.tip && (
                                                    <small className="text-muted">
                                                        <i className="bi bi-lightbulb"></i> {step.tip}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'resources':
                    return (
                        <div key={index} className="resources my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <div className="row">
                                {block.items.map((item, i) => (
                                    <div key={i} className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h6 className="card-title">
                                                    {item.type === 'book' && <i className="bi bi-book me-2"></i>}
                                                    {item.type === 'tool' && <i className="bi bi-tools me-2"></i>}
                                                    {item.title}
                                                </h6>
                                                {item.author && <p className="card-text text-muted">by {item.author}</p>}
                                                {item.link && (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                        Visit Resource
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'chapter':
                    return (
                        <div key={index} className="chapter my-5">
                            <h2 className="chapter-title border-bottom pb-2 mb-4">
                                {block.chapterNumber && (
                                    <span className="chapter-number me-2">
                    Chapter {block.chapterNumber}:
                  </span>
                                )}
                                {block.title}
                            </h2>
                            <div className="chapter-content">
                                <ContentRenderer content={block.content} />
                            </div>
                            {block.summary && (
                                <div className="chapter-summary alert alert-light mt-4">
                                    <h5>Chapter Summary</h5>
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.summary}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    );

                case 'appendix':
                    return (
                        <div key={index} className="appendix my-5">
                            <h2 className="appendix-title border-bottom pb-2 mb-4">
                <span className="appendix-label me-2">
                  Appendix {block.appendixLetter || 'A'}:
                </span>
                                {block.title}
                            </h2>
                            <div className="appendix-content">
                                <ContentRenderer content={block.content} />
                            </div>
                            {block.reference && (
                                <div className="appendix-reference small text-muted mt-3">
                                    {block.reference}
                                </div>
                            )}
                        </div>
                    );

                case 'narrative-section':
                    return (
                        <section key={index} className="narrative-section mb-5">
                            {block.title && <h2 className="narrative-title mb-4">{block.title}</h2>}
                            <div className="narrative-content">
                                {block.narrative?.map((item, idx) => {
                                    switch (item.type) {
                                        case 'paragraph':
                                            return (
                                                <div key={idx} className="narrative-paragraph mb-3">
                                                    <p>{item.content}</p>
                                                    {item.subpoints && (
                                                        <ul className="subpoints mt-2 ps-4">
                                                            {item.subpoints.map((point, i) => (
                                                                <li key={i}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            );


                                        case 'visual':
                                            if (item.contentType === 'image') {
                                                return (
                                                    <figure key={idx} className="narrative-visual text-center my-4">
                                                        <img
                                                            src={item.src}
                                                            alt={item.caption || ''}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '400px' }}
                                                        />
                                                        {item.caption && (
                                                            <figcaption className="mt-2 text-muted">
                                                                {item.caption}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                );
                                            }
                                            return null;

                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        </section>
                    );

                case 'concept-explainer':
                    return (
                        <div key={index} className="concept-explainer card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="concept-level mb-3">
                                    <span className="badge bg-primary">Level: {block.difficulty}</span>
                                </div>
                                <ReactMarkdown components={markdownComponents}>
                                    {block.explanation}
                                </ReactMarkdown>
                                {block.analogy && (
                                    <div className="concept-analogy alert alert-light mt-3">
                                        <strong>Analogy: </strong>{block.analogy}
                                    </div>
                                )}
                            </div>
                        </div>
                    );

                case 'cheat-sheet':
                    return (
                        <div key={index} className="cheat-sheet card border-warning my-4">
                            <div className="card-header bg-warning bg-opacity-10">
                                <h3 className="card-title">{block.title}</h3>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    {block.items.map((item, i) => (
                                        <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{item.term}</div>
                                                {item.description}
                                            </div>
                                            {item.example && (
                                                <span className="badge bg-primary rounded-pill">Ex</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );

                case 'case-study':
                    return (
                        <div key={index} className="case-study card my-4">
                            <div className="card-body">
                                {block.title && <h3 className="card-title">{block.title}</h3>}

                                {/* Handle metrics if present */}
                                {block.metrics && (
                                    <div className="case-study-meta mb-3">
                                        {typeof block.metrics === 'object' ? (
                                            Object.entries(block.metrics).map(([key, value]) => (
                                                <span key={key} className="badge bg-secondary me-2">
                  {key}: {value}
                </span>
                                            ))
                                        ) : (
                                            <span className="badge bg-secondary">{block.metrics}</span>
                                        )}
                                    </div>
                                )}

                                {/* Handle examples array if present */}
                                {block.examples && Array.isArray(block.examples) && (
                                    <div className="case-study-examples">
                                        {block.examples.map((example, i) => (
                                            <div key={i} className="example-item mb-3">
                                                <h5>{example.name}</h5>
                                                {example.description && <p>{example.description}</p>}
                                                {example.lesson && (
                                                    <div className="alert alert-light">
                                                        <strong>Lesson:</strong> {example.lesson}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Handle single example object if present */}
                                {block.example && typeof block.example === 'object' && (
                                    <div className="case-study-example mb-3">
                                        <h5>{block.example.name || block.example.title}</h5>
                                        {block.example.description && <p>{block.example.description}</p>}
                                        {block.example.lesson && (
                                            <div className="alert alert-light">
                                                <strong>Lesson:</strong> {block.example.lesson}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Handle phases array if present */}
                                {block.phases && Array.isArray(block.phases) && (
                                    <div className="case-study-phases mt-3">
                                        <h5>Implementation Phases</h5>
                                        <ul className="list-group">
                                            {block.phases.map((phase, i) => (
                                                <li key={i} className="list-group-item">
                                                    <strong>{phase.name || phase.phase}:</strong> {phase.activity || phase.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Handle analysis array if present */}
                                {block.analysis && Array.isArray(block.analysis) && (
                                    <div className="case-study-analysis mt-3">
                                        <h5>Analysis</h5>
                                        <ul>
                                            {block.analysis.map((item, i) => (
                                                <li key={i}>
                                                    <strong>{item.failure || item.issue}:</strong> {item.stlcSolution || item.solution}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Handle lessons array if present */}
                                {block.lessons && Array.isArray(block.lessons) && (
                                    <div className="case-study-lessons alert alert-light mt-3">
                                        <h5>Key Lessons</h5>
                                        <ul>
                                            {block.lessons.map((lesson, i) => (
                                                <li key={i}>{lesson}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Handle scenario/decisions format */}
                                {block.scenario && (
                                    <div className="case-study-scenario mt-3">
                                        <h5>Scenario</h5>
                                        <p>{block.scenario}</p>
                                        {block.decisions && Array.isArray(block.decisions) && (
                                            <div className="case-study-decisions mt-2">
                                                <h6>Key Decisions:</h6>
                                                <ul className="list-group">
                                                    {block.decisions.map((decision, i) => (
                                                        <li key={i} className="list-group-item">
                                                            <strong>{decision.aspect}:</strong> {decision.detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                case 'analogy':
                    return (
                        <div key={index} className="analogy card my-4">
                            <div className="card-body">
                                {block.title && <h3 className="card-title">{block.title}</h3>}

                                {block.content && (
                                    <p className="card-text">{block.content}</p>
                                )}

                                {block.examples && Array.isArray(block.examples) && (
                                    <div className="analogy-examples mt-3">
                                        <h5>Examples</h5>
                                        <ul>
                                            {block.examples.map((example, i) => (
                                                <li key={i}>{example}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {block.lesson && (
                                    <div className="alert alert-light mt-3">
                                        <strong>Lesson:</strong> {block.lesson}
                                    </div>
                                )}
                            </div>
                        </div>
                    );


                case 'video-tutorial':
                    return (
                        <div key={index} className="video-tutorial card my-4">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={block.embedUrl}
                                    title={block.title}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="video-meta mb-2">
                                    <span className="text-muted me-3">Duration: {block.duration}</span>
                                    <span className="text-muted">Skill Level: {block.level}</span>
                                </div>
                                <ReactMarkdown components={markdownComponents}>
                                    {block.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    );

                case 'decision-tree':
                    return (
                        <div key={index} className="decision-tree card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="decision-tree-container">
                                    {block.nodes.map((node, i) => (
                                        <div key={i} className={`decision-node ${node.isRoot ? 'root-node' : ''}`}>
                                            <div className="node-question p-3 bg-light rounded">
                                                {node.question}
                                            </div>
                                            <div className="node-options mt-2">
                                                {node.options.map((option, j) => (
                                                    <div key={j} className="node-option ps-4 my-2">
                                                        → {option.answer} {option.result &&
                                                        <span className="badge bg-success ms-2">Result</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );

                case 'interactive-lab':
                    return (
                        <div key={index} className="interactive-lab card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="lab-description mb-3">
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.description}
                                    </ReactMarkdown>
                                </div>
                                <div className="lab-environment p-3 bg-light rounded">
                                    <h5>Environment Setup</h5>
                                    <pre><code>{block.environmentSetup}</code></pre>
                                </div>
                                <div className="lab-actions mt-3">
                                    <button className="btn btn-primary me-2">Run Code</button>
                                    <button className="btn btn-outline-secondary">Reset</button>
                                </div>
                            </div>
                        </div>
                    );

                case 'qa':
                    return (
                        <div key={index} className="qa card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="accordion" id={`qaAccordion-${index}`}>
                                    {block.questions.map((q, i) => (
                                        <div key={i} className="accordion-item">
                                            <h4 className="accordion-header">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#qaCollapse-${index}-${i}`}
                                                >
                                                    {q.question}
                                                </button>
                                            </h4>
                                            <div
                                                id={`qaCollapse-${index}-${i}`}
                                                className="accordion-collapse collapse"
                                                data-bs-parent={`#qaAccordion-${index}`}
                                            >
                                                <div className="accordion-body">
                                                    <ReactMarkdown components={markdownComponents}>
                                                        {q.answer}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );

                case 'project':
                    return (
                        <div key={index} className="project card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="project-meta mb-3">
                                    <span className="badge bg-primary me-2">Tech: {block.technology}</span>
                                    <span className="badge bg-secondary">Duration: {block.duration}</span>
                                </div>
                                <h5>Objectives</h5>
                                <ul>
                                    {block.objectives.map((obj, i) => (
                                        <li key={i}>{obj}</li>
                                    ))}
                                </ul>
                                <h5>Steps</h5>
                                <ol>
                                    {block.steps.map((step, i) => (
                                        <li key={i}>
                                            <strong>{step.title}: </strong>
                                            {step.description}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    );

                case 'expert-discussion':
                    return (
                        <div key={index} className="expert-discussion card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="participants mb-3">
                                    {block.participants.map((p, i) => (
                                        <span key={i} className="badge bg-info me-2">{p}</span>
                                    ))}
                                </div>
                                <div className="discussion-content">
                                    {block.transcript.map((item, i) => (
                                        <div key={i} className={`message ${item.role === 'expert' ? 'expert-message' : 'moderator-message'}`}>
                                            <strong>{item.speaker}: </strong>
                                            {item.content}
                                        </div>
                                    ))}
                                </div>
                                <div className="key-takeaways mt-3">
                                    <h5>Key Takeaways</h5>
                                    <ul>
                                        {block.keyTakeaways.map((takeaway, i) => (
                                            <li key={i}>{takeaway}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );

                case 'quote':
                    return (
                        <blockquote key={index} className="quote-block my-4 p-3 bg-light border-start border-5 border-primary">
                            <div className="quote-content">
                                <i className="fas fa-quote-left me-2 text-muted"></i>
                                <ReactMarkdown components={markdownComponents}>
                                    {block.text}
                                </ReactMarkdown>
                            </div>
                            {block.source && (
                                <footer className="quote-footer mt-2 text-end text-muted">
                                    — {block.source}
                                    {block.context && (
                                        <span className="quote-context small d-block">{block.context}</span>
                                    )}
                                </footer>
                            )}
                        </blockquote>
                    );

                case 'heading':
                    return (
                        <div
                            key={index}
                            className={`heading-wrapper ${block.divider ? 'with-divider' : ''}`}
                            style={{ textAlign: block.align || 'left' }}
                        >
                            {block.level === 1 && (
                                <h1 className="heading-1 my-4">
                                    {block.icon && <i className={`me-2 ${block.icon}`}></i>}
                                    {block.text}
                                    {block.badge && (
                                        <span className="heading-badge ms-2 badge bg-primary">
                      {block.badge}
                    </span>
                                    )}
                                </h1>
                            )}
                            {block.level === 2 && (
                                <h2 className="heading-2 my-3">
                                    {block.icon && <i className={`me-2 ${block.icon}`}></i>}
                                    {block.text}
                                    {block.subtext && (
                                        <small className="heading-subtext ms-2 text-muted">
                                            {block.subtext}
                                        </small>
                                    )}
                                </h2>
                            )}
                            {block.level === 3 && (
                                <h3 className="heading-3 my-2">
                                    {block.text}
                                    {block.tooltip && (
                                        <sup>
                                            <i
                                                className="fas fa-info-circle ms-1 text-info"
                                                data-bs-toggle="tooltip"
                                                title={block.tooltip}
                                            ></i>
                                        </sup>
                                    )}
                                </h3>
                            )}
                        </div>
                    );

                case 'example':
                    return (
                        <div key={index} className={`example-block ${block.variant || 'default'}`}>
                            <div className="example-header">
                                {block.icon && <i className={`example-icon ${block.icon}`}></i>}
                                <span className="example-title">
                  {block.title || (block.type === 'do' ? 'Best Practice' : 'Example')}
                                    {block.language && (
                                        <span className="example-language badge rounded-pill">
                      {block.language}
                    </span>
                                    )}
                </span>
                            </div>

                            <div className="example-content">
                                {block.code ? (
                                    <SyntaxHighlighter
                                        language={block.language || 'javascript'}
                                        style={atomDark}
                                        showLineNumbers={block.showLineNumbers}
                                    >
                                        {block.code}
                                    </SyntaxHighlighter>
                                ) : (
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.content}
                                    </ReactMarkdown>
                                )}
                            </div>

                            {block.description && (
                                <div className="example-description">
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.description}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {block.note && (
                                <div className="example-note">
                                    <i className="fas fa-lightbulb"></i> {block.note}
                                </div>
                            )}
                        </div>
                    );

                case 'subsection':
                    return (
                        <div key={index} className={`subsection ${block.collapsible ? 'collapsible' : ''}`}>
                            <div
                                className="subsection-header d-flex justify-content-between align-items-center"
                                onClick={block.collapsible ? () => toggleCollapse(index) : undefined}
                            >
                                <h3 className="subsection-title">
                                    {block.icon && <i className={`${block.icon} me-2`}></i>}
                                    {block.title}
                                    {block.status && (
                                        <span className={`status-badge ms-2 badge ${getStatusBadgeClass(block.status)}`}>
                      {block.status}
                    </span>
                                    )}
                                </h3>
                                {block.collapsible && (
                                    <i className={`fas ${isCollapsed(index) ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                                )}
                            </div>

                            {(!block.collapsible || !isCollapsed(index)) && (
                                <div className="subsection-content">
                                    <ContentRenderer content={block.content} />
                                    {block.footer && (
                                        <div className="subsection-footer">
                                            <ReactMarkdown components={markdownComponents}>
                                                {block.footer}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );

                case 'sectioned-list':
                    return (
                        <div key={index} className={`sectioned-list ${block.variant || 'default'}`}>
                            {block.title && (
                                <h3 className="sectioned-list-title">
                                    {block.icon && <i className={`${block.icon} me-2`}></i>}
                                    {block.title}
                                </h3>
                            )}

                            <div className="list-container">
                                {block.sections.map((section, sectionIndex) => (
                                    <div
                                        key={sectionIndex}
                                        className="list-section"
                                        data-section-depth={section.depth || 0}
                                    >
                                        {section.title && (
                                            <h4 className="section-title">
                                                {section.icon && <i className={`${section.icon} me-2`}></i>}
                                                {section.title}
                                            </h4>
                                        )}

                                        <div className="section-content">
                                            <ul className="section-items">
                                                {section.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="list-item">
                                                        {typeof item === 'string' ? (
                                                            <div className="item-content">{item}</div>
                                                        ) : (
                                                            <>
                                                                {item.title && <strong className="item-title">{item.title}</strong>}
                                                                {item.content && <div className="item-content">{item.content}</div>}
                                                            </>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'timeline':
                    return (
                        <div key={index} className="timeline-container my-5">
                            {block.title && <h3 className="mb-4 text-center font-weight-bold text-primary">{block.title}</h3>}
                            <div className="timeline">
                                {block.events.map((event, i) => (
                                    <div key={i} className="timeline-event position-relative">
                                        {/* Timeline connector line */}
                                        <div className="timeline-connector"></div>

                                        {/* Date bubble */}
                                        <div className="timeline-date bg-primary text-white rounded-pill shadow-sm">
                                            {event.date || event.year}
                                        </div>

                                        {/* Content card with hover effects */}
                                        <div className="timeline-content card border-0 shadow-sm transition-all">
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h5 className="card-title mb-3 font-weight-bold text-dark">
                                                        {event.title || event.event}
                                                    </h5>
                                                    {event.icon && <span className="timeline-icon ml-2">{event.icon}</span>}
                                                </div>

                                                {/* Collapsible description */}
                                                <div className="card-text text-muted">
                                                    {event.description || event.detail}
                                                </div>

                                                {/* Optional links */}
                                                <div className="mt-3 d-flex flex-wrap gap-2">
                                                    {event.link && (
                                                        <a
                                                            href={event.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Learn More
                                                        </a>
                                                    )}
                                                    {event.links?.map((link, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-secondary"
                                                        >
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </div>

                                                {/* Optional image */}
                                                {event.image && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'flashcards':
                    return (
                        <div key={index} className="flashcards-container my-4">
                            {block.title && <h4 className="mb-4">{block.title}</h4>}
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {block.cards.map((card, i) => {
                                    const cardId = `card-${index}-${i}`;
                                    const isFlipped = flashcardStates[cardId];
                                    return (
                                        <div key={i} className="col">
                                            <div
                                                className={`flashcard card h-100 ${isFlipped ? 'flipped' : ''}`}
                                                onClick={() => interactive && toggleFlashcard(cardId)}
                                            >
                                                <div className="card-front card-body d-flex flex-column">
                                                    <h5 className="card-title">{card.frontTitle || 'Question'}</h5>
                                                    <div className="card-content mt-auto">
                                                        {renderContent(card.front)}
                                                    </div>
                                                    {interactive && (
                                                        <div className="card-hint text-muted small mt-2">
                                                            Click to reveal answer
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="card-back card-body d-flex flex-column">
                                                    <h5 className="card-title">{card.backTitle || 'Answer'}</h5>
                                                    <div className="card-content">
                                                        {renderContent(card.back)}
                                                    </div>
                                                    {interactive && (
                                                        <div className="card-hint text-muted small mt-2">
                                                            Click to show question
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                case 'cards':
                    return (
                        <div key={index} className="content-cards-container my-4">
                            {block.title && <h4 className="cards-title mb-4 text-center">{block.title}</h4>}

                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {(block.cards || block.items)?.map((card, cardIndex) => (
                                    <div key={cardIndex} className="col">
                                        <div className="content-card card h-100 border-0 shadow-sm">

                                            {/* Card Header */}
                                            <div className="card-header bg-transparent border-bottom-0 text-center">
                                                {card.icon && (
                                                    <div className="card-icon mb-3">
                                                        <i className={`${card.icon} fa-2x text-primary`}></i>
                                                    </div>
                                                )}
                                                {card.title && (
                                                    <h5 className="card-title mb-2">{card.title}</h5>
                                                )}
                                                {card.description && (
                                                    <p className="card-subtitle text-muted mb-0">{card.description}</p>
                                                )}
                                            </div>

                                            {/* Card Body */}
                                            <div className="card-body">
                                                {/* Details */}
                                                {card.details && (
                                                    <div className="card-details">
                                                        <ReactMarkdown components={markdownComponents}>
                                                            {card.details}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}

                                                {/* Additional content types can be added here */}
                                                {card.stats && (
                                                    <div className="card-stats mt-3">
                                                        <div className="row text-center">
                                                            {card.stats.map((stat, statIndex) => (
                                                                <div key={statIndex} className="col-4">
                                                                    <div className="stat-value text-primary fw-bold">{stat.value}</div>
                                                                    <div className="stat-label small text-muted">{stat.label}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {card.items && (
                                                    <ul className="card-list list-unstyled mt-3">
                                                        {card.items.map((item, itemIndex) => (
                                                            <li key={itemIndex} className="card-list-item d-flex align-items-start mb-2">
                                                                <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Card Footer */}
                                            {(card.actions || card.footer) && (
                                                <div className="card-footer bg-transparent border-top-0">
                                                    {card.actions && (
                                                        <div className="card-actions">
                                                            {card.actions.map((action, actionIndex) => (
                                                                <a
                                                                    key={actionIndex}
                                                                    href={action.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`btn btn-sm me-2 ${
                                                                        action.primary ? 'btn-primary' : 'btn-outline-primary'
                                                                    }`}
                                                                >
                                                                    {action.icon && <i className={`${action.icon} me-1`}></i>}
                                                                    {action.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {card.footer && (
                                                        <div className="card-footer-text small text-muted mt-2">
                                                            {card.footer}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cards Container Footer */}
                            {block.footer && (
                                <div className="cards-footer text-center mt-4 small text-muted">
                                    {block.footer}
                                </div>
                            )}
                        </div>
                    );

                case 'tabs':
                    const tabBlockId = `tabs-${index}`;
                    const activeTab = activeTabs[tabBlockId] || 0;

                    return (
                        <div key={index} className="tabs-container card my-4">
                            <div className="card-header">
                                <ul className="nav nav-tabs card-header-tabs">
                                    {block.tabs.map((tab, i) => (
                                        <li key={i} className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === i ? 'active' : ''}`}
                                                onClick={() => interactive && handleTabChange(tabBlockId, i)}
                                            >
                                                {tab.icon && <i className={`${tab.icon} me-2`}></i>}
                                                {tab.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-body">
                                {block.tabs.map((tab, i) => (
                                    <div
                                        key={i}
                                        className={`tab-pane ${activeTab === i ? 'active' : 'd-none'}`}
                                    >
                                        {renderContent(tab.content)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'callout':
                    return (
                        <div key={index} className={`callout callout-${block.variant || 'info'} my-4`}>
                            <div className="callout-header d-flex align-items-center">
                                {block.icon && <i className={`${block.icon} me-2`}></i>}
                                <h5 className="callout-title mb-0">{block.title}</h5>
                            </div>
                            <div className="callout-content">
                                {renderContent(block.content)}
                                {block.link && (
                                    <a
                                        href={block.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="callout-link"
                                    >
                                        {block.link.text || 'Learn more'} <i className="fas fa-arrow-right ms-1"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    );

                case 'interactive-diagram':
                    return (
                        <div key={index} className="interactive-diagram my-4">
                            {block.title && <h4 className="mb-3">{block.title}</h4>}

                            <div className="diagram-container position-relative" style={{ minHeight: '500px' }}>
                                <img
                                    src={block.image}
                                    alt={block.title}
                                    className="img-fluid"
                                    style={{ opacity: 0.2, position: 'absolute', top: 0, left: 0 }}
                                />

                                {/* Render nodes */}
                                {block.nodes.map((node, i) => (
                                    <div
                                        key={node.id}
                                        className="diagram-node position-absolute text-center p-2 rounded shadow-sm bg-white"
                                        style={{
                                            top: `${node.y}px`,
                                            left: `${node.x}px`,
                                            transform: 'translate(-50%, -50%)',
                                            cursor: 'pointer',
                                            border: '1px solid #ccc',
                                            zIndex: 2
                                        }}
                                        onClick={() => console.log(`Node clicked: ${node.label}`)}
                                    >
                                        {node.label}
                                    </div>
                                ))}

                                {/* Render connections */}
                                <svg
                                    className="diagram-lines position-absolute"
                                    style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                                >
                                    {block.connections.map((conn, i) => {
                                        const [fromId, toId] = conn.split(' → ');
                                        const fromNode = block.nodes.find(n => n.id === fromId);
                                        const toNode = block.nodes.find(n => n.id === toId);

                                        if (!fromNode || !toNode) return null;

                                        return (
                                            <line
                                                key={i}
                                                x1={fromNode.x}
                                                y1={fromNode.y}
                                                x2={toNode.x}
                                                y2={toNode.y}
                                                stroke="#007bff"
                                                strokeWidth="2"
                                                markerEnd="url(#arrowhead)"
                                            />
                                        );
                                    })}

                                    {/* Arrowhead marker */}
                                    <defs>
                                        <marker
                                            id="arrowhead"
                                            markerWidth="10"
                                            markerHeight="7"
                                            refX="10"
                                            refY="3.5"
                                            orient="auto"
                                        >
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#007bff" />
                                        </marker>
                                    </defs>
                                </svg>
                            </div>

                            {block.caption && <p className="mt-3 text-muted">{block.caption}</p>}
                        </div>
                    );


                case 'analogy':
                    return (
                        <div key={index} className="analogy card my-4">
                            <div className="card-body">
                                {block.title && <h3 className="card-title">{block.title}</h3>}

                                {block.content && (
                                    <p className="card-text">{block.content}</p>
                                )}

                                {block.examples && Array.isArray(block.examples) && (
                                    <div className="analogy-examples mt-3">
                                        <h5>Examples</h5>
                                        <ul>
                                            {block.examples.map((example, i) => (
                                                <li key={i}>{example}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {block.lesson && (
                                    <div className="alert alert-light mt-3">
                                        <strong>Lesson:</strong> {block.lesson}
                                    </div>
                                )}
                            </div>
                        </div>
                    );


                case 'video-tutorial':
                    return (
                        <div key={index} className="video-tutorial card my-4">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={block.embedUrl}
                                    title={block.title}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="video-meta mb-2">
                                    <span className="text-muted me-3">Duration: {block.duration}</span>
                                    <span className="text-muted">Skill Level: {block.level}</span>
                                </div>
                                <ReactMarkdown components={markdownComponents}>
                                    {block.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    );

                case 'decision-tree':
                    return (
                        <div key={index} className="decision-tree card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="decision-tree-container">
                                    {block.nodes.map((node, i) => (
                                        <div key={i} className={`decision-node ${node.isRoot ? 'root-node' : ''}`}>
                                            <div className="node-question p-3 bg-light rounded">
                                                {node.question}
                                            </div>
                                            <div className="node-options mt-2">
                                                {node.options.map((option, j) => (
                                                    <div key={j} className="node-option ps-4 my-2">
                                                        → {option.answer} {option.result &&
                                                        <span className="badge bg-success ms-2">Result</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );

                case 'interactive-lab':
                    return (
                        <div key={index} className="interactive-lab card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="lab-description mb-3">
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.description}
                                    </ReactMarkdown>
                                </div>
                                <div className="lab-environment p-3 bg-light rounded">
                                    <h5>Environment Setup</h5>
                                    <pre><code>{block.environmentSetup}</code></pre>
                                </div>
                                <div className="lab-actions mt-3">
                                    <button className="btn btn-primary me-2">Run Code</button>
                                    <button className="btn btn-outline-secondary">Reset</button>
                                </div>
                            </div>
                        </div>
                    );

                case 'qa':
                    return (
                        <div key={index} className="qa card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="accordion" id={`qaAccordion-${index}`}>
                                    {block.questions.map((q, i) => (
                                        <div key={i} className="accordion-item">
                                            <h4 className="accordion-header">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#qaCollapse-${index}-${i}`}
                                                >
                                                    {q.question}
                                                </button>
                                            </h4>
                                            <div
                                                id={`qaCollapse-${index}-${i}`}
                                                className="accordion-collapse collapse"
                                                data-bs-parent={`#qaAccordion-${index}`}
                                            >
                                                <div className="accordion-body">
                                                    <ReactMarkdown components={markdownComponents}>
                                                        {q.answer}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );

                case 'project':
                    return (
                        <div key={index} className="project card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="project-meta mb-3">
                                    <span className="badge bg-primary me-2">Tech: {block.technology}</span>
                                    <span className="badge bg-secondary">Duration: {block.duration}</span>
                                </div>
                                <h5>Objectives</h5>
                                <ul>
                                    {block.objectives.map((obj, i) => (
                                        <li key={i}>{obj}</li>
                                    ))}
                                </ul>
                                <h5>Steps</h5>
                                <ol>
                                    {block.steps.map((step, i) => (
                                        <li key={i}>
                                            <strong>{step.title}: </strong>
                                            {step.description}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    );

                case 'expert-discussion':
                    return (
                        <div key={index} className="expert-discussion card my-4">
                            <div className="card-body">
                                <h3 className="card-title">{block.title}</h3>
                                <div className="participants mb-3">
                                    {block.participants.map((p, i) => (
                                        <span key={i} className="badge bg-info me-2">{p}</span>
                                    ))}
                                </div>
                                <div className="discussion-content">
                                    {block.transcript.map((item, i) => (
                                        <div key={i} className={`message ${item.role === 'expert' ? 'expert-message' : 'moderator-message'}`}>
                                            <strong>{item.speaker}: </strong>
                                            {item.content}
                                        </div>
                                    ))}
                                </div>
                                <div className="key-takeaways mt-3">
                                    <h5>Key Takeaways</h5>
                                    <ul>
                                        {block.keyTakeaways.map((takeaway, i) => (
                                            <li key={i}>{takeaway}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );

                case 'quote':
                    return (
                        <blockquote key={index} className="quote-block my-4 p-3 bg-light border-start border-5 border-primary">
                            <div className="quote-content">
                                <i className="fas fa-quote-left me-2 text-muted"></i>
                                <ReactMarkdown components={markdownComponents}>
                                    {block.text}
                                </ReactMarkdown>
                            </div>
                            {block.source && (
                                <footer className="quote-footer mt-2 text-end text-muted">
                                    — {block.source}
                                    {block.context && (
                                        <span className="quote-context small d-block">{block.context}</span>
                                    )}
                                </footer>
                            )}
                        </blockquote>
                    );

                case 'heading':
                    return (
                        <div
                            key={index}
                            className={`heading-wrapper ${block.divider ? 'with-divider' : ''}`}
                            style={{ textAlign: block.align || 'left' }}
                        >
                            {block.level === 1 && (
                                <h1 className="heading-1 my-4">
                                    {block.icon && <i className={`me-2 ${block.icon}`}></i>}
                                    {block.text}
                                    {block.badge && (
                                        <span className="heading-badge ms-2 badge bg-primary">
                      {block.badge}
                    </span>
                                    )}
                                </h1>
                            )}
                            {block.level === 2 && (
                                <h2 className="heading-2 my-3">
                                    {block.icon && <i className={`me-2 ${block.icon}`}></i>}
                                    {block.text}
                                    {block.subtext && (
                                        <small className="heading-subtext ms-2 text-muted">
                                            {block.subtext}
                                        </small>
                                    )}
                                </h2>
                            )}
                            {block.level === 3 && (
                                <h3 className="heading-3 my-2">
                                    {block.text}
                                    {block.tooltip && (
                                        <sup>
                                            <i
                                                className="fas fa-info-circle ms-1 text-info"
                                                data-bs-toggle="tooltip"
                                                title={block.tooltip}
                                            ></i>
                                        </sup>
                                    )}
                                </h3>
                            )}
                        </div>
                    );

                case 'example':
                    return (
                        <div key={index} className={`example-block ${block.variant || 'default'}`}>
                            <div className="example-header">
                                {block.icon && <i className={`example-icon ${block.icon}`}></i>}
                                <span className="example-title">
                  {block.title || (block.type === 'do' ? 'Best Practice' : 'Example')}
                                    {block.language && (
                                        <span className="example-language badge rounded-pill">
                      {block.language}
                    </span>
                                    )}
                </span>
                            </div>

                            <div className="example-content">
                                {block.code ? (
                                    <SyntaxHighlighter
                                        language={block.language || 'javascript'}
                                        style={atomDark}
                                        showLineNumbers={block.showLineNumbers}
                                    >
                                        {block.code}
                                    </SyntaxHighlighter>
                                ) : (
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.content}
                                    </ReactMarkdown>
                                )}
                            </div>

                            {block.description && (
                                <div className="example-description">
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.description}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {block.note && (
                                <div className="example-note">
                                    <i className="fas fa-lightbulb"></i> {block.note}
                                </div>
                            )}
                        </div>
                    );

                case 'subsection':
                    return (
                        <div key={index} className={`subsection ${block.collapsible ? 'collapsible' : ''}`}>
                            <div
                                className="subsection-header d-flex justify-content-between align-items-center"
                                onClick={block.collapsible ? () => toggleCollapse(index) : undefined}
                            >
                                <h3 className="subsection-title">
                                    {block.icon && <i className={`${block.icon} me-2`}></i>}
                                    {block.title}
                                    {block.status && (
                                        <span className={`status-badge ms-2 badge ${getStatusBadgeClass(block.status)}`}>
                      {block.status}
                    </span>
                                    )}
                                </h3>
                                {block.collapsible && (
                                    <i className={`fas ${isCollapsed(index) ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                                )}
                            </div>

                            {(!block.collapsible || !isCollapsed(index)) && (
                                <div className="subsection-content">
                                    <ContentRenderer content={block.content} />
                                    {block.footer && (
                                        <div className="subsection-footer">
                                            <ReactMarkdown components={markdownComponents}>
                                                {block.footer}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );

                case 'sectioned-list':
                    return (
                        <div key={index} className={`sectioned-list ${block.variant || 'default'}`}>
                            {block.title && (
                                <h3 className="sectioned-list-title">
                                    {block.icon && <i className={`${block.icon} me-2`}></i>}
                                    {block.title}
                                </h3>
                            )}

                            <div className="list-container">
                                {block.sections.map((section, sectionIndex) => (
                                    <div
                                        key={sectionIndex}
                                        className="list-section"
                                        data-section-depth={section.depth || 0}
                                    >
                                        {section.title && (
                                            <h4 className="section-title">
                                                {section.icon && <i className={`${section.icon} me-2`}></i>}
                                                {section.title}
                                            </h4>
                                        )}

                                        <div className="section-content">
                                            <ul className="section-items">
                                                {section.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="list-item">
                                                        {typeof item === 'string' ? (
                                                            <div className="item-content">{item}</div>
                                                        ) : (
                                                            <>
                                                                {item.title && <strong className="item-title">{item.title}</strong>}
                                                                {item.content && <div className="item-content">{item.content}</div>}
                                                            </>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'timeline':
                    return (
                        <div key={index} className="timeline-container my-5">
                            {block.title && <h3 className="mb-4 text-center font-weight-bold text-primary">{block.title}</h3>}
                            <div className="timeline">
                                {block.events.map((event, i) => (
                                    <div key={i} className="timeline-event position-relative">
                                        {/* Timeline connector line */}
                                        <div className="timeline-connector"></div>

                                        {/* Date bubble */}
                                        <div className="timeline-date bg-primary text-white rounded-pill shadow-sm">
                                            {event.date || event.year}
                                        </div>

                                        {/* Content card with hover effects */}
                                        <div className="timeline-content card border-0 shadow-sm transition-all">
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h5 className="card-title mb-3 font-weight-bold text-dark">
                                                        {event.title || event.event}
                                                    </h5>
                                                    {event.icon && <span className="timeline-icon ml-2">{event.icon}</span>}
                                                </div>

                                                {/* Collapsible description */}
                                                <div className="card-text text-muted">
                                                    {event.description || event.detail}
                                                </div>

                                                {/* Optional links */}
                                                <div className="mt-3 d-flex flex-wrap gap-2">
                                                    {event.link && (
                                                        <a
                                                            href={event.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Learn More
                                                        </a>
                                                    )}
                                                    {event.links?.map((link, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-secondary"
                                                        >
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </div>

                                                {/* Optional image */}
                                                {event.image && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'flashcards':
                    return (
                        <div key={index} className="flashcards-container my-4">
                            {block.title && <h4 className="mb-4">{block.title}</h4>}
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {block.cards.map((card, i) => {
                                    const cardId = `card-${index}-${i}`;
                                    const isFlipped = flashcardStates[cardId];
                                    return (
                                        <div key={i} className="col">
                                            <div
                                                className={`flashcard card h-100 ${isFlipped ? 'flipped' : ''}`}
                                                onClick={() => interactive && toggleFlashcard(cardId)}
                                            >
                                                <div className="card-front card-body d-flex flex-column">
                                                    <h5 className="card-title">{card.frontTitle || 'Question'}</h5>
                                                    <div className="card-content mt-auto">
                                                        {renderContent(card.front)}
                                                    </div>
                                                    {interactive && (
                                                        <div className="card-hint text-muted small mt-2">
                                                            Click to reveal answer
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="card-back card-body d-flex flex-column">
                                                    <h5 className="card-title">{card.backTitle || 'Answer'}</h5>
                                                    <div className="card-content">
                                                        {renderContent(card.back)}
                                                    </div>
                                                    {interactive && (
                                                        <div className="card-hint text-muted small mt-2">
                                                            Click to show question
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                case 'cards':
                    return (
                        <div key={index} className="content-cards-container my-4">
                            {block.title && <h4 className="cards-title mb-4 text-center">{block.title}</h4>}

                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {(block.cards || block.items)?.map((card, cardIndex) => (
                                    <div key={cardIndex} className="col">
                                        <div className="content-card card h-100 border-0 shadow-sm">

                                            {/* Card Header */}
                                            <div className="card-header bg-transparent border-bottom-0 text-center">
                                                {card.icon && (
                                                    <div className="card-icon mb-3">
                                                        <i className={`${card.icon} fa-2x text-primary`}></i>
                                                    </div>
                                                )}
                                                {card.title && (
                                                    <h5 className="card-title mb-2">{card.title}</h5>
                                                )}
                                                {card.description && (
                                                    <p className="card-subtitle text-muted mb-0">{card.description}</p>
                                                )}
                                            </div>

                                            {/* Card Body */}
                                            <div className="card-body">
                                                {/* Details */}
                                                {card.details && (
                                                    <div className="card-details">
                                                        <ReactMarkdown components={markdownComponents}>
                                                            {card.details}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}

                                                {/* Additional content types can be added here */}
                                                {card.stats && (
                                                    <div className="card-stats mt-3">
                                                        <div className="row text-center">
                                                            {card.stats.map((stat, statIndex) => (
                                                                <div key={statIndex} className="col-4">
                                                                    <div className="stat-value text-primary fw-bold">{stat.value}</div>
                                                                    <div className="stat-label small text-muted">{stat.label}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {card.items && (
                                                    <ul className="card-list list-unstyled mt-3">
                                                        {card.items.map((item, itemIndex) => (
                                                            <li key={itemIndex} className="card-list-item d-flex align-items-start mb-2">
                                                                <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Card Footer */}
                                            {(card.actions || card.footer) && (
                                                <div className="card-footer bg-transparent border-top-0">
                                                    {card.actions && (
                                                        <div className="card-actions">
                                                            {card.actions.map((action, actionIndex) => (
                                                                <a
                                                                    key={actionIndex}
                                                                    href={action.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`btn btn-sm me-2 ${
                                                                        action.primary ? 'btn-primary' : 'btn-outline-primary'
                                                                    }`}
                                                                >
                                                                    {action.icon && <i className={`${action.icon} me-1`}></i>}
                                                                    {action.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {card.footer && (
                                                        <div className="card-footer-text small text-muted mt-2">
                                                            {card.footer}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cards Container Footer */}
                            {block.footer && (
                                <div className="cards-footer text-center mt-4 small text-muted">
                                    {block.footer}
                                </div>
                            )}
                        </div>
                    );



                case 'callout':
                    return (
                        <div key={index} className={`callout callout-${block.variant || 'info'} my-4`}>
                            <div className="callout-header d-flex align-items-center">
                                {block.icon && <i className={`${block.icon} me-2`}></i>}
                                <h5 className="callout-title mb-0">{block.title}</h5>
                            </div>
                            <div className="callout-content">
                                {renderContent(block.content)}
                                {block.link && (
                                    <a
                                        href={block.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="callout-link"
                                    >
                                        {block.link.text || 'Learn more'} <i className="fas fa-arrow-right ms-1"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    );

                case 'interactive-diagram':
                    return (
                        <div key={index} className="interactive-diagram my-4">
                            {block.title && <h4 className="mb-3">{block.title}</h4>}

                            <div className="diagram-container position-relative" style={{ minHeight: '500px' }}>
                                <img
                                    src={block.image}
                                    alt={block.title}
                                    className="img-fluid"
                                    style={{ opacity: 0.2, position: 'absolute', top: 0, left: 0 }}
                                />

                                {/* Render nodes */}
                                {block.nodes.map((node, i) => (
                                    <div
                                        key={node.id}
                                        className="diagram-node position-absolute text-center p-2 rounded shadow-sm bg-white"
                                        style={{
                                            top: `${node.y}px`,
                                            left: `${node.x}px`,
                                            transform: 'translate(-50%, -50%)',
                                            cursor: 'pointer',
                                            border: '1px solid #ccc',
                                            zIndex: 2
                                        }}
                                        onClick={() => console.log(`Node clicked: ${node.label}`)}
                                    >
                                        {node.label}
                                    </div>
                                ))}

                                {/* Render connections */}
                                <svg
                                    className="diagram-lines position-absolute"
                                    style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                                >
                                    {block.connections.map((conn, i) => {
                                        const [fromId, toId] = conn.split(' → ');
                                        const fromNode = block.nodes.find(n => n.id === fromId);
                                        const toNode = block.nodes.find(n => n.id === toId);

                                        if (!fromNode || !toNode) return null;

                                        return (
                                            <line
                                                key={i}
                                                x1={fromNode.x}
                                                y1={fromNode.y}
                                                x2={toNode.x}
                                                y2={toNode.y}
                                                stroke="#007bff"
                                                strokeWidth="2"
                                                markerEnd="url(#arrowhead)"
                                            />
                                        );
                                    })}

                                    {/* Arrowhead marker */}
                                    <defs>
                                        <marker
                                            id="arrowhead"
                                            markerWidth="10"
                                            markerHeight="7"
                                            refX="10"
                                            refY="3.5"
                                            orient="auto"
                                        >
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#007bff" />
                                        </marker>
                                    </defs>
                                </svg>
                            </div>

                            {block.caption && <p className="mt-3 text-muted">{block.caption}</p>}
                        </div>
                    );


                case 'coverage-chart':
                    return (
                        <div key={index} className="coverage-chart my-4">
                            {block.title && <h5 className="mb-3">{block.title}</h5>}
                            <div className="chart-container bg-light p-3 rounded">
                                <div className="coverage-bars">
                                    {block.metrics?.map((metric, i) => (
                                        <div key={i} className="coverage-metric mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="metric-label">{metric.label}</span>
                                                <span className="metric-value">{metric.value}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '20px' }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${metric.value}%`,
                                                        backgroundColor: metric.color || '#007bff'
                                                    }}
                                                    aria-valuenow={metric.value}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {metric.value}%
                                                </div>
                                            </div>
                                            {metric.target && (
                                                <div className="metric-target small text-muted mt-1">
                                                    Target: {metric.target}%
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {block.legend && (
                                <div className="chart-legend mt-2 small text-muted">
                                    {block.legend}
                                </div>
                            )}
                        </div>
                    );
                case 'conclusion':
                    return (
                        <div key={index} className="conclusion-section my-5">
                            {/* Optional Hero Icon/Header */}
                            {block.icon && (
                                <div className="text-center mb-4">
                                    <i className={`${block.icon} fa-3x text-primary`}></i>
                                </div>
                            )}

                            {/* Main Title */}
                            {block.title && (
                                <h2 className="text-center mb-4">{block.title}</h2>
                            )}

                            {/* Summary Text */}
                            {block.summary && (
                                <div className="conclusion-summary lead mb-4">
                                    <ReactMarkdown components={markdownComponents}>
                                        {block.summary}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {/* Key Takeaways */}
                            {block.keyTakeaways && (
                                <div className="key-takeaways card border-primary mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">
                                            <i className="fas fa-key me-2"></i>Key Takeaways
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="mb-0">
                                            {block.keyTakeaways.map((takeaway, i) => (
                                                <li key={i} className="mb-2">
                                                    <ReactMarkdown components={markdownComponents}>
                                                        {takeaway}
                                                    </ReactMarkdown>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Call to Action */}
                            {block.cta && (
                                <div className="call-to-action text-center p-4 bg-light rounded">
                                    <h5>{block.cta.title}</h5>
                                    <p className="mb-3">{block.cta.description}</p>
                                    {block.cta.button && (
                                        <a
                                            href={block.cta.button.link}
                                            className="btn btn-primary btn-lg"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {block.cta.button.text}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    );


                default:
                    return (
                        <div className="unsupported-block my-3">
                            <div className="alert alert-warning">
                                Unsupported content type: {block.type}
                            </div>
                            {block.fallback && renderContent(block.fallback)}
                        </div>
                    );
            }
        } catch (error) {
            return (
                <ContentErrorBoundary
                    key={blockKey}
                    fallback={block.fallback || "Failed to render this block"}
                    onRetry={() => handleRetryBlock(index)}
                >
                    <div className="alert alert-danger">
                        Rendering error: {error.message}
                    </div>
                </ContentErrorBoundary>
            );
        }
    };

    if (typeof content === 'string') {
        return (
            <ContentErrorBoundary fallback={content}>
                <ReactMarkdown components={markdownComponents}>
                    {content}
                </ReactMarkdown>
            </ContentErrorBoundary>
        );
    }

    if (Array.isArray(content)) {
        return (
            <div className={`content-renderer theme-${theme}`}>
                {content.map((block, index) => (
                    <ContentErrorBoundary
                        key={`${index}-${retryKeys[index] || '0'}`}
                        fallback={block.fallback}
                        onRetry={() => handleRetryBlock(index)}
                    >
                        {renderBlock(block, index)}
                    </ContentErrorBoundary>
                ))}
            </div>
        );
    }

    return (
        <div className="alert alert-info text-center">
            No content available or unrecognized content format
        </div>
    );
};

ContentRenderer.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    contentType: PropTypes.string,
    baseUrl: PropTypes.string,
    imageWrapperClass: PropTypes.string,
    imageClass: PropTypes.string,
    maxImageHeight: PropTypes.string,
    fallbackImage: PropTypes.string,
    theme: PropTypes.oneOf(['light', 'dark']),
    interactive: PropTypes.bool,
    onContentRendered: PropTypes.func
};

ContentRenderer.defaultProps = {
    theme: 'light',
    interactive: true
};

export default React.memo(ContentRenderer);