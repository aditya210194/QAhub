// src/components/renderers/hooks/useMarkdownRenderer.js
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { markdownComponents } from '../utils/rendererUtils';

export const useMarkdownRenderer = () => {
    const renderMarkdown = useMemo(() => {
        return (content) => {
            if (!content) return null;

            return (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownComponents}
                >
                    {content}
                </ReactMarkdown>
            );
        };
    }, []);

    return { renderMarkdown };
};