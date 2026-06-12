// src/components/renderers/BlockLoader.js
import React, { lazy, Suspense } from 'react';

// ❌ REMOVE this import
// import OriginalContentRenderer from '../ContentRenderer';

const blockRegistry = {
    text: lazy(() => import('./blocks/TextBlock')),
    heading: lazy(() => import('./blocks/HeadingBlock')),
    code: lazy(() => import('./blocks/CodeBlock')),
    image: lazy(() => import('./blocks/ImageBlock')),
    table: lazy(() => import('./blocks/TableBlock')),
    list: lazy(() => import('./blocks/ListBlock')),
    quote: lazy(() => import('./blocks/QuoteBlock')),
    definition: lazy(() => import('./blocks/DefinitionBlock')),
    analogy: lazy(() => import('./blocks/AnalogyBlock')),
    formula: lazy(() => import('./blocks/FormulaBlock')),
    'key-points': lazy(() => import('./blocks/KeyPointsBlock')),
    'case-study': lazy(() => import('./blocks/CaseStudyBlock')),
    'best-practices': lazy(() => import('./blocks/BestPracticesBlock')),
    'common-mistakes': lazy(() => import('./blocks/CommonMistakesBlock')),
    quiz: lazy(() => import('./blocks/QuizBlock')),
    'interactive-quiz': lazy(() => import('./blocks/InteractiveQuizBlock')),
    'interactive-calculator': lazy(() => import('./blocks/InteractiveCalculatorBlock')),
    flashcards: lazy(() => import('./blocks/FlashcardsBlock')),
    section: lazy(() => import('./blocks/SectionBlock')),
    subsection: lazy(() => import('./blocks/SubsectionBlock')),
    'definition-list': lazy(() => import('./blocks/DefinitionListBlock')),
    'step-by-step': lazy(() => import('./blocks/StepByStepBlock')),
    qa: lazy(() => import('./blocks/QaBlock')),
    'myth-busters': lazy(() => import('./blocks/MythBustersBlock')),
    chart: lazy(() => import('./blocks/ChartBlock')),
    'comparison-grid': lazy(() => import('./blocks/ComparisonGridBlock')),
    diagram: lazy(() => import('./blocks/DiagramBlock')),
    example: lazy(() => import('./blocks/ExampleBlock')),
    infographic: lazy(() => import('./blocks/InfographicBlock')),
    timeline: lazy(() => import('./blocks/TimelineBlock')),
    resources: lazy(() => import('./blocks/ResourcesBlock')),
    tabs: lazy(() => import('./blocks/TabsBlock')),
    'decision-tree': lazy(() => import('./blocks/DecisionTreeBlock')),
    chapter: lazy(() => import('./blocks/ChapterBlock')),
    'trend-cards': lazy(() => import('./blocks/TrendCardsBlock')),
    'tip-box': lazy(() => import('./blocks/TipBoxBlock')),
    'process-steps': lazy(() => import('./blocks/ProcessStepsBlock')),
    'steps': lazy(() => import('./blocks/ProcessStepsBlock')),
    callout: lazy(() => import('./blocks/CalloutBlock')),
    'metrics-grid': lazy(() => import('./blocks/MetricsGridBlock')),
    'tools-list': lazy(() => import('./blocks/ToolsListBlock')),
    markdown: lazy(() => import('./blocks/MarkdownBlock')),
    statistic: lazy(() => import('./blocks/StatisticBlock')),
    template: lazy(() => import('./blocks/TemplateBlock')),
    // Definition blocks
    'definition': lazy(() => import('./blocks/DefinitionBoxBlock')),
    'definition-box': lazy(() => import('./blocks/DefinitionBoxBlock')),
    'term': lazy(() => import('./blocks/DefinitionBoxBlock')),
    'glossary': lazy(() => import('./blocks/DefinitionBoxBlock')),

    // Checklist blocks
    'checklist': lazy(() => import('./blocks/ChecklistBlock')),
    'check-list': lazy(() => import('./blocks/ChecklistBlock')),
    'todo': lazy(() => import('./blocks/ChecklistBlock')),

    // Technique blocks
    'technique-cards': lazy(() => import('./blocks/TechniqueCardsBlock')),
    'technique': lazy(() => import('./blocks/TechniqueCardsBlock')),
    'techniques': lazy(() => import('./blocks/TechniqueCardsBlock')),
    'method': lazy(() => import('./blocks/TechniqueCardsBlock')),

    // Concept explainer blocks
    'concept-explainer': lazy(() => import('./blocks/ConceptExplainerBlock')),
    'concept': lazy(() => import('./blocks/ConceptExplainerBlock')),
    'explainer': lazy(() => import('./blocks/ConceptExplainerBlock')),
    'term-explainer': lazy(() => import('./blocks/ConceptExplainerBlock')),

    // Diagram visual blocks (handle both "diagram visual" and "diagram-visual")
    'diagram visual': lazy(() => import('./blocks/DiagramVisualBlock')),
    'diagram-visual': lazy(() => import('./blocks/DiagramVisualBlock')),
    'diagram': lazy(() => import('./blocks/DiagramVisualBlock')),
    'visual-diagram': lazy(() => import('./blocks/DiagramVisualBlock')),
    'architecture': lazy(() => import('./blocks/DiagramVisualBlock')),
    'flowchart': lazy(() => import('./blocks/DiagramVisualBlock')),
    'component-diagram': lazy(() => import('./blocks/DiagramVisualBlock')),

    cards: lazy(() => import('./blocks/CardsBlock')),
    module: lazy(() => import('./blocks/ModuleBlock')),
    conclusion: lazy(() => import('./blocks/ConclusionBlock')),
    categorization: lazy(() => import('./blocks/CategorizationBlock')),
    strategy: lazy(() => import('./blocks/StrategyBlock')),
    'measurement-guidelines': lazy(() => import('./blocks/MeasurementGuidelinesBlock')),
    'dashboard': lazy(() => import('./blocks/DashboardBlock')),
    'tool-categories': lazy(() => import('./blocks/ToolCategoriesBlock')),
    'integration-scenario': lazy(() => import('./blocks/IntegrationScenarioBlock')),
    'implementation-phases': lazy(() => import('./blocks/ImplementationPhasesBlock')),
    'roles-responsibilities': lazy(() => import('./blocks/RolesResponsibilitiesBlock')),
    'trends': lazy(() => import('./blocks/TrendsBlock')),
    'next-generation': lazy(() => import('./blocks/NextGenerationBlock')),
    'phase-analysis': lazy(() => import('./blocks/PhaseAnalysisBlock')),
    'cost-analysis': lazy(() => import('./blocks/CostAnalysisBlock')),
    'implementation-roadmap': lazy(() => import('./blocks/ImplementationRoadmapBlock')),
    'advanced-topics': lazy(() => import('./blocks/AdvancedTopicsBlock')),
    'future-trends': lazy(() => import('./blocks/FutureTrendsBlock')),
    'factor-analysis': lazy(() => import('./blocks/FactorAnalysisBlock')),
    'root-cause-analysis': lazy(() => import('./blocks/RootCauseAnalysisBlock')),
    'design-principles': lazy(() => import('./blocks/DesignPrinciplesBlock')),
    'test-design-techniques': lazy(() => import('./blocks/TestDesignTechniquesBlock')),
    'continuous-improvement': lazy(() => import('./blocks/ContinuousImprovementBlock')),
    // Add more as needed
};

// Simple fallback that doesn't depend on original renderer
const SimpleFallback = ({ block }) => {
    // If block is an object with type but no content, show helpful message
    if (block && typeof block === 'object' && block.type) {
        return (
            <div className="alert alert-warning my-2 p-2 small">
                <strong>⚠️ Block type:</strong> {block.type}
                <br />
                <small>This block type is not yet implemented in the new renderer.</small>
                {block.title && <div className="mt-1 text-muted">Title: {block.title}</div>}
            </div>
        );
    }

    // Handle string content
    if (typeof block === 'string') {
        return <div className="my-2 p-2 border rounded bg-light">{block}</div>;
    }

    // Handle content property
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

const BlockLoaderFallback = () => (
    <div className="d-inline-block ms-2">
        <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const BlockLoader = ({ type, block, ...props }) => {
    const Component = blockRegistry[type];

    if (Component) {
        return (
            <Suspense fallback={<BlockLoaderFallback />}>
                <Component block={block} {...props} />
            </Suspense>
        );
    }

    // Use simple fallback instead of original renderer
    return <SimpleFallback block={block} {...props} />;
};

export default BlockLoader;