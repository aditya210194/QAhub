// ContentRenderer.js - Chunk 1 (imports, error boundary, helpers, main renderer)

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
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

// ========= Error Boundary (same behaviour, safe to drop in) =========
class ContentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Content rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.onRetry?.();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback } = this.props;

    if (hasError) {
      return (
        <div className="alert alert-danger my-3">
          <h5 className="mb-2">Rendering error</h5>
          {fallback && (
            <div className="mb-2">
              {typeof fallback === 'string' ? fallback : null}
            </div>
          )}
          <pre className="small text-muted">
            {error?.message}
            {'\n'}
            {errorInfo?.componentStack}
          </pre>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary mt-2"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ========= Small helpers reused across blocks =========

const getDifficultyColor = (difficulty = '') => {
  const diff = difficulty.toLowerCase();
  const map = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
    expert: 'dark',
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  };
  return map[diff] || 'primary';
};

const getStatusBadgeClass = (status = '') => {
  const map = {
    new: 'badge-status-new',
    updated: 'badge-status-updated',
    deprecated: 'badge-status-deprecated',
    experimental: 'badge-status-experimental'
  };
  return map[status] || 'bg-secondary';
};

// You can keep more helpers from your original file here, unchanged,
// but consider grouping them logically like this.

// ========= Placeholder / stub components for all block types =========
// In next chunks we'll replace these stubs with the real JSX from your file,
// just wrapped with React.memo and minor efficiency tweaks.

/** Example stub – will be replaced in later chunks */
const FormulaBlock = React.memo(function FormulaBlock({ block, index }) {
  // TODO: Paste original FormulaBlock JSX here in Chunk 2.
  return (
    <div className="formula-block">
      {/* original formula JSX goes here */}
      <pre className="text-muted small">
        FormulaBlock placeholder (index {index})
      </pre>
    </div>
  );
});

const AnalogyBlock = React.memo(function AnalogyBlock({ block, index }) {
  // TODO: Paste original AnalogyBlock JSX here in Chunk 3.
  return (
    <div className="analogy-block">
      {/* original analogy JSX goes here */}
      <pre className="text-muted small">
        AnalogyBlock placeholder (index {index})
      </pre>
    </div>
  );
});

// Add similar memo-wrapped stubs for ALL your types that appear in the big switch:
// DefinitionBlock, InteractiveQuiz, InteractiveCalculator, etc.
// For now, keep them simple; we’ll replace contents in later chunks.

// ========= Main ContentRenderer with memo + useCallback/useMemo =========

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
  // state that was originally arrays is good candidate for Map/Set,
  // but to avoid breaking behaviour we keep it same shape for now.
  const [collapsedSubsections, setCollapsedSubsections] = useState([]);
  const [collapsedSections, setCollapsedSections] = useState([]);
  const [copiedItems, setCopiedItems] = useState({});
  const [activeTabs, setActiveTabs] = useState({});
  const [flashcardStates, setFlashcardStates] = useState({});
  const [calculatorValues, setCalculatorValues] = useState({});
  const [retryKeys, setRetryKeys] = useState({});

  // stable keys for error boundary recovery
  const contentKey = useMemo(() => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return JSON.stringify(content);
    return uuidv4();
  }, [content]);

  useEffect(() => {
    if (onContentRendered) onContentRendered();
  }, [contentKey, onContentRendered]);

  const handleRetryBlock = useCallback((blockId) => {
    setRetryKeys((prev) => ({
      ...prev,
      [blockId]: uuidv4()
    }));
  }, []);

  const isCollapsed = useCallback(
    (index) => collapsedSubsections.includes(index),
    [collapsedSubsections]
  );

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

  const handleCopy = useCallback((id) => {
    setCopiedItems((prev) => ({
      ...prev,
      [id]: true
    }));
    setTimeout(() => {
      setCopiedItems((prev) => ({
        ...prev,
        [id]: false
      }));
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

  // ========= Block dispatcher (replaces huge switch in one place) =========
  const blockComponents = useMemo(
    () => ({
      formula: FormulaBlock,
      analogy: AnalogyBlock,
      // definition: DefinitionBlock,
      // quiz: InteractiveQuiz,
      // 'interactive-calculator': InteractiveCalculator,
      // ... add ALL other mappings from your original switch
      default: ({ block }) => (
        <div className="unsupported-block my-3">
          Unsupported content type: <code>{block?.type}</code>
        </div>
      )
    }),
    []
  );

  const renderBlock = useCallback(
    (block, index, depth = 0) => {
      if (!block || typeof block !== 'object') return null;
      const type = block.type || 'default';
      const BlockComponent = blockComponents[type] || blockComponents.default;
      const blockKeyBase = `${type}-${index}-${depth}`;
      const blockKey = `${blockKeyBase}-${retryKeys[blockKeyBase] || '0'}`;

      return (
        <ContentErrorBoundary
          key={blockKey}
          fallback={block.fallback}
          onRetry={() => handleRetryBlock(blockKeyBase)}
        >
          <BlockComponent
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
          />
        </ContentErrorBoundary>
      );
    },
    [
      blockComponents,
      baseUrl,
      imageWrapperClass,
      imageClass,
      maxImageHeight,
      fallbackImage,
      theme,
      interactive,
      retryKeys,
      handleRetryBlock,
      isCollapsed,
      toggleCollapse,
      copiedItems,
      handleCopy,
      activeTabs,
      handleTabChange,
      flashcardStates,
      toggleFlashcard,
      calculatorValues
    ]
  );

  // ========= Top-level rendering, same semantics as your original =========
  if (typeof content === 'string') {
    return (
      <div className={`content-renderer theme-${theme}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  if (Array.isArray(content)) {
    return (
      <div className={`content-renderer theme-${theme}`}>
        {content.map((block, index) => renderBlock(block, index, 0))}
      </div>
    );
  }

  if (content && typeof content === 'object') {
    // e.g., when a single block object is passed
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
