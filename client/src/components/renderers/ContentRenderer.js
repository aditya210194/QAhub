// New lightweight wrapper - keeps same interface as original
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Import hooks
import { useRendererState } from './hooks/useRendererState';
import { useContentKey } from './hooks/useContentKey';

// Import utilities
import { getDifficultyColor, getStatusBadgeClass, markdownComponents } from './utils/rendererUtils';

// Import block loader
import BlockLoader from './BlockLoader';

// Error Boundary (same as original)
class ContentErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

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
                                <div className="mt-2">{this.props.fallback}</div>
                            )}
                        </div>
                        <button className="btn btn-sm btn-outline-secondary" onClick={this.handleRetry}>
                            Retry
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Image Renderer Component
const ImageRenderer = React.memo(({ src, alt, title, baseUrl, imageWrapperClass, imageClass, maxImageHeight, fallbackImage, interactive }) => {
    const [imageSrc, setImageSrc] = useState(src.startsWith('http') ? src : `${baseUrl}${src}`);
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

    const handleLoad = useCallback(() => setLoading(false), []);

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
                        <button className="btn btn-sm btn-light" onClick={() => window.open(imageSrc, '_blank')}>
                            <i className="fas fa-expand"></i>
                        </button>
                    </div>
                )}
            </div>
            {title && <figcaption className="mt-2 text-muted">{title}</figcaption>}
        </figure>
    );
});

// Main ContentRenderer Component
const ContentRenderer = React.memo(function ContentRenderer({
                                                                content,
                                                                contentType = 'markdown',
                                                                baseUrl = '',
                                                                imageWrapperClass = 'text-center my-4',
                                                                imageClass = 'img-fluid rounded',
                                                                maxImageHeight = '400px',
                                                                fallbackImage = process.env.PUBLIC_URL + '/fallback-image.png',
                                                                theme = 'light',
                                                                interactive = true,
                                                                onContentRendered
                                                            }) {
    // Use custom hooks for state management
    const {
        collapsedSubsections,
        collapsedSections,
        copiedItems,
        activeTabs,
        flashcardStates,
        calculatorValues,
        retryKeys,
        isCollapsed,
        toggleCollapse,
        handleCopy,
        handleTabChange,
        toggleFlashcard,
        setCalculatorValues,
        handleRetryBlock
    } = useRendererState();

    // Generate unique content key
    const contentKey = useContentKey(content);

    // Notify when content is rendered
    useEffect(() => {
        if (onContentRendered) onContentRendered();
    }, [contentKey, onContentRendered]);

    // Render content based on type
    const renderContent = useCallback((content) => {
        return (
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
    }, [baseUrl, imageWrapperClass, imageClass, maxImageHeight, fallbackImage, theme, interactive]);

    const renderBlock = useCallback((block, index, depth = 0) => {
        if (!block || typeof block !== 'object') return null;
        if (depth > 25) return null;

        const blockKey = `${index}-${retryKeys[index] || '0'}`;
        const type = block.type || 'default';

        return (
            <ContentErrorBoundary
                key={blockKey}
                fallback={block.fallback}
                onRetry={() => handleRetryBlock(index)}
            >
                <BlockLoader
                    type={type}
                    block={block}
                    index={index}
                    depth={depth}
                    baseUrl={baseUrl}
                    imageWrapperClass={imageWrapperClass}
                    imageClass={imageClass}
                    maxImageHeight={maxImageHeight}
                    fallbackImage={fallbackImage}
                    theme={theme}
                    interactive={interactive}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                    copiedItems={copiedItems}
                    onCopy={handleCopy}
                    activeTabs={activeTabs}
                    onTabChange={handleTabChange}
                    flashcardStates={flashcardStates}
                    toggleFlashcard={toggleFlashcard}
                    calculatorValues={calculatorValues}
                    setCalculatorValues={setCalculatorValues}
                    renderBlock={renderBlock}
                    renderContent={renderContent}
                />
            </ContentErrorBoundary>
        );
    }, [retryKeys, handleRetryBlock, baseUrl, imageWrapperClass, imageClass, maxImageHeight, fallbackImage, theme, interactive, isCollapsed, toggleCollapse, copiedItems, handleCopy, activeTabs, handleTabChange, flashcardStates, toggleFlashcard, calculatorValues, renderContent]);

    // Handle string content
    if (typeof content === 'string') {
        return (
            <ContentErrorBoundary fallback={content}>
                <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
            </ContentErrorBoundary>
        );
    }

    // Handle array content
    if (Array.isArray(content)) {
        return (
            <div className={`content-renderer theme-${theme}`}>
                {content.map((block, index) => renderBlock(block, index, 0))}
            </div>
        );
    }

    // Handle single object content
    if (content && typeof content === 'object') {
        return (
            <div className={`content-renderer theme-${theme}`}>
                {renderBlock(content, 0, 0)}
            </div>
        );
    }

    return (
        <div className="alert alert-info text-center my-3">
            No content available or unrecognized content format
        </div>
    );
});

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
    contentType: 'markdown',
    baseUrl: '',
    imageWrapperClass: 'text-center my-4',
    imageClass: 'img-fluid rounded',
    maxImageHeight: '400px',
    fallbackImage: process.env.PUBLIC_URL + '/fallback-image.png',
    theme: 'light',
    interactive: true,
    onContentRendered: null
};

export default React.memo(ContentRenderer);