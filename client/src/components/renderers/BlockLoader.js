// src/components/renderers/BlockLoader.js
import React, { lazy, Suspense, useState, useCallback } from 'react';

// ─── Retry wrapper for lazy imports ──────────────────────────────────────────
// When webpack chunk loading times out, this retries up to 3 times before
// giving up. Fixes "ChunkLoadError: Loading chunk ... failed (timeout)" errors.
function lazyWithRetry(importFn, retries = 3, delay = 400) {
    return lazy(() => {
        const attempt = (triesLeft) =>
            importFn().catch((err) => {
                if (triesLeft <= 0) throw err;
                return new Promise((resolve) =>
                    setTimeout(() => resolve(attempt(triesLeft - 1)), delay)
                );
            });
        return attempt(retries);
    });
}

// ─── Block registry ───────────────────────────────────────────────────────────
const blockRegistry = {
    text:                       lazyWithRetry(() => import('./blocks/TextBlock')),
    heading:                    lazyWithRetry(() => import('./blocks/HeadingBlock')),
    code:                       lazyWithRetry(() => import('./blocks/CodeBlock')),
    image:                      lazyWithRetry(() => import('./blocks/ImageBlock')),
    table:                      lazyWithRetry(() => import('./blocks/TableBlock')),
    list:                       lazyWithRetry(() => import('./blocks/ListBlock')),
    quote:                      lazyWithRetry(() => import('./blocks/QuoteBlock')),
    definition:                 lazyWithRetry(() => import('./blocks/DefinitionBoxBlock')),
    'definition-box':           lazyWithRetry(() => import('./blocks/DefinitionBoxBlock')),
    term:                       lazyWithRetry(() => import('./blocks/DefinitionBoxBlock')),
    glossary:                   lazyWithRetry(() => import('./blocks/DefinitionBoxBlock')),
    analogy:                    lazyWithRetry(() => import('./blocks/AnalogyBlock')),
    formula:                    lazyWithRetry(() => import('./blocks/FormulaBlock')),
    'key-points':               lazyWithRetry(() => import('./blocks/KeyPointsBlock')),
    'case-study':               lazyWithRetry(() => import('./blocks/CaseStudyBlock')),
    'best-practices':           lazyWithRetry(() => import('./blocks/BestPracticesBlock')),
    'common-mistakes':          lazyWithRetry(() => import('./blocks/CommonMistakesBlock')),
    quiz:                       lazyWithRetry(() => import('./blocks/QuizBlock')),
    'interactive-quiz':         lazyWithRetry(() => import('./blocks/InteractiveQuizBlock')),
    'interactive-calculator':   lazyWithRetry(() => import('./blocks/InteractiveCalculatorBlock')),
    flashcards:                 lazyWithRetry(() => import('./blocks/FlashcardsBlock')),
    section:                    lazyWithRetry(() => import('./blocks/SectionBlock')),
    subsection:                 lazyWithRetry(() => import('./blocks/SubsectionBlock')),
    'definition-list':          lazyWithRetry(() => import('./blocks/DefinitionListBlock')),
    'step-by-step':             lazyWithRetry(() => import('./blocks/StepByStepBlock')),
    qa:                         lazyWithRetry(() => import('./blocks/QaBlock')),
    'myth-busters':             lazyWithRetry(() => import('./blocks/MythBustersBlock')),
    chart:                      lazyWithRetry(() => import('./blocks/ChartBlock')),
    'comparison-grid':          lazyWithRetry(() => import('./blocks/ComparisonGridBlock')),
    'diagram visual':           lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    'diagram-visual':           lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    diagram:                    lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    'visual-diagram':           lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    architecture:               lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    flowchart:                  lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    'component-diagram':        lazyWithRetry(() => import('./blocks/DiagramVisualBlock')),
    example:                    lazyWithRetry(() => import('./blocks/ExampleBlock')),
    infographic:                lazyWithRetry(() => import('./blocks/InfographicBlock')),
    timeline:                   lazyWithRetry(() => import('./blocks/TimelineBlock')),
    resources:                  lazyWithRetry(() => import('./blocks/ResourcesBlock')),
    tabs:                       lazyWithRetry(() => import('./blocks/TabsBlock')),
    'decision-tree':            lazyWithRetry(() => import('./blocks/DecisionTreeBlock')),
    chapter:                    lazyWithRetry(() => import('./blocks/ChapterBlock')),
    'trend-cards':              lazyWithRetry(() => import('./blocks/TrendCardsBlock')),
    'tip-box':                  lazyWithRetry(() => import('./blocks/TipBoxBlock')),
    'process-steps':            lazyWithRetry(() => import('./blocks/ProcessStepsBlock')),
    steps:                      lazyWithRetry(() => import('./blocks/ProcessStepsBlock')),
    callout:                    lazyWithRetry(() => import('./blocks/CalloutBlock')),
    'metrics-grid':             lazyWithRetry(() => import('./blocks/MetricsGridBlock')),
    'tools-list':               lazyWithRetry(() => import('./blocks/ToolsListBlock')),
    markdown:                   lazyWithRetry(() => import('./blocks/MarkdownBlock')),
    statistic:                  lazyWithRetry(() => import('./blocks/StatisticBlock')),
    template:                   lazyWithRetry(() => import('./blocks/TemplateBlock')),
    checklist:                  lazyWithRetry(() => import('./blocks/ChecklistBlock')),
    'check-list':               lazyWithRetry(() => import('./blocks/ChecklistBlock')),
    todo:                       lazyWithRetry(() => import('./blocks/ChecklistBlock')),
    'technique-cards':          lazyWithRetry(() => import('./blocks/TechniqueCardsBlock')),
    technique:                  lazyWithRetry(() => import('./blocks/TechniqueCardsBlock')),
    techniques:                 lazyWithRetry(() => import('./blocks/TechniqueCardsBlock')),
    method:                     lazyWithRetry(() => import('./blocks/TechniqueCardsBlock')),
    'concept-explainer':        lazyWithRetry(() => import('./blocks/ConceptExplainerBlock')),
    concept:                    lazyWithRetry(() => import('./blocks/ConceptExplainerBlock')),
    explainer:                  lazyWithRetry(() => import('./blocks/ConceptExplainerBlock')),
    'term-explainer':           lazyWithRetry(() => import('./blocks/ConceptExplainerBlock')),
    cards:                      lazyWithRetry(() => import('./blocks/CardsBlock')),
    module:                     lazyWithRetry(() => import('./blocks/ModuleBlock')),
    conclusion:                 lazyWithRetry(() => import('./blocks/ConclusionBlock')),
    categorization:             lazyWithRetry(() => import('./blocks/CategorizationBlock')),
    strategy:                   lazyWithRetry(() => import('./blocks/StrategyBlock')),
    'measurement-guidelines':   lazyWithRetry(() => import('./blocks/MeasurementGuidelinesBlock')),
    dashboard:                  lazyWithRetry(() => import('./blocks/DashboardBlock')),
    'tool-categories':          lazyWithRetry(() => import('./blocks/ToolCategoriesBlock')),
    'integration-scenario':     lazyWithRetry(() => import('./blocks/IntegrationScenarioBlock')),
    'implementation-phases':    lazyWithRetry(() => import('./blocks/ImplementationPhasesBlock')),
    'roles-responsibilities':   lazyWithRetry(() => import('./blocks/RolesResponsibilitiesBlock')),
    trends:                     lazyWithRetry(() => import('./blocks/TrendsBlock')),
    'next-generation':          lazyWithRetry(() => import('./blocks/NextGenerationBlock')),
    'phase-analysis':           lazyWithRetry(() => import('./blocks/PhaseAnalysisBlock')),
    'cost-analysis':            lazyWithRetry(() => import('./blocks/CostAnalysisBlock')),
    'implementation-roadmap':   lazyWithRetry(() => import('./blocks/ImplementationRoadmapBlock')),
    'advanced-topics':          lazyWithRetry(() => import('./blocks/AdvancedTopicsBlock')),
    'future-trends':            lazyWithRetry(() => import('./blocks/FutureTrendsBlock')),
    'factor-analysis':          lazyWithRetry(() => import('./blocks/FactorAnalysisBlock')),
    'root-cause-analysis':      lazyWithRetry(() => import('./blocks/RootCauseAnalysisBlock')),
    'design-principles':        lazyWithRetry(() => import('./blocks/DesignPrinciplesBlock')),
    'test-design-techniques':   lazyWithRetry(() => import('./blocks/TestDesignTechniquesBlock')),
    'continuous-improvement':   lazyWithRetry(() => import('./blocks/ContinuousImprovementBlock')),
    'ai-technologies':          lazyWithRetry(() => import('./blocks/AITechnologiesBlock')),
    comparison:                 lazyWithRetry(() => import('./blocks/TechnologyComparisonBlock')),
    'benefits-analysis':        lazyWithRetry(() => import('./blocks/BenefitsAnalysisBlock')),
    'roi-calculation':          lazyWithRetry(() => import('./blocks/ROICalculationBlock')),
    'applications-grid':        lazyWithRetry(() => import('./blocks/ApplicationsGridBlock')),
    'real-world-scenarios':     lazyWithRetry(() => import('./blocks/RealWorldScenariosBlock')),
    'tools-categorization':     lazyWithRetry(() => import('./blocks/ToolsCategorizationBlock')),
    'selection-framework':      lazyWithRetry(() => import('./blocks/SelectionFrameworkBlock')),
    'success-factors':          lazyWithRetry(() => import('./blocks/SuccessFactorsBlock')),
    'success-metrics':          lazyWithRetry(() => import('./blocks/SuccessMetricsBlock')),
    'skill-development':        lazyWithRetry(() => import('./blocks/SkillDevelopmentBlock')),
    'training-roadmap':         lazyWithRetry(() => import('./blocks/TrainingRoadmapBlock')),
    'challenges-framework':     lazyWithRetry(() => import('./blocks/ChallengesFrameworkBlock')),
    'risk-mitigation':          lazyWithRetry(() => import('./blocks/RiskMitigationBlock')),
    'preparation-strategy':     lazyWithRetry(() => import('./blocks/PreparationStrategyBlock')),
    'quick-start-guide':        lazyWithRetry(() => import('./blocks/QuickStartGuideBlock')),
    'next-steps':               lazyWithRetry(() => import('./blocks/NextStepsBlock')),
};

// ─── Fallback for unregistered block types ────────────────────────────────────
const SimpleFallback = ({ block }) => {
    if (block && typeof block === 'object' && block.type) {
        return (
            <div className="alert alert-warning my-2 p-2 small">
                <strong>⚠️ Block type:</strong> {block.type}
                <br />
                <small>This block type is not yet implemented.</small>
                {block.title && <div className="mt-1 text-muted">Title: {block.title}</div>}
            </div>
        );
    }
    if (typeof block === 'string') {
        return <div className="my-2 p-2 border rounded bg-light">{block}</div>;
    }
    const content = block?.content || block?.value || block?.code || block?.text;
    if (content && typeof content === 'string') {
        return (
            <div className="my-2 p-2 border rounded bg-light">
                <small className="text-muted">[Block type: {block?.type}]</small>
                <div className="mt-1">{content}</div>
            </div>
        );
    }
    return (
        <div className="alert alert-info my-2 p-2 small">
            <strong>📦 Block data:</strong>
            <pre className="mt-1 mb-0 small text-muted" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(block, null, 2).substring(0, 200)}
            </pre>
        </div>
    );
};

// ─── Loading spinner shown while a chunk is being fetched ────────────────────
const BlockLoaderFallback = () => (
    <div className="d-inline-block ms-2">
        <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

// ─── Error shown when all retries are exhausted ───────────────────────────────
const ChunkErrorFallback = ({ type, onRetry }) => (
    <div className="alert alert-warning my-2 p-2 small d-flex align-items-center justify-content-between">
        <span>⚠️ Failed to load block <strong>{type}</strong></span>
        <button className="btn btn-sm btn-outline-secondary ms-2" onClick={onRetry}>
            Retry
        </button>
    </div>
);

// ─── BlockLoader ──────────────────────────────────────────────────────────────
const BlockLoader = ({ type, block, ...props }) => {
    const [retryKey, setRetryKey] = useState(0);
    const [failed, setFailed] = useState(false);

    const handleRetry = useCallback(() => {
        setFailed(false);
        setRetryKey(k => k + 1);
    }, []);

    const Component = blockRegistry[type];

    if (!Component) {
        return <SimpleFallback block={block} {...props} />;
    }

    if (failed) {
        return <ChunkErrorFallback type={type} onRetry={handleRetry} />;
    }

    return (
        <Suspense fallback={<BlockLoaderFallback />} key={retryKey}>
            <ChunkErrorCatcher type={type} onError={() => setFailed(true)}>
                <Component block={block} {...props} />
            </ChunkErrorCatcher>
        </Suspense>
    );
};

// ─── Catches errors thrown by lazy components (incl. ChunkLoadError) ─────────
class ChunkErrorCatcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error) {
        console.warn(`[BlockLoader] chunk load error for type "${this.props.type}":`, error.message);
        this.props.onError?.();
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

export default BlockLoader;