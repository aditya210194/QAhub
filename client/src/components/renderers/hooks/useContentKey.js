// src/components/renderers/hooks/useContentKey.js
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useContentKey = (content) => {
    return useMemo(() => {
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) return JSON.stringify(content);
        if (content && typeof content === 'object') {
            // For objects, create a stable key based on content
            try {
                return JSON.stringify(content);
            } catch (e) {
                return uuidv4();
            }
        }
        return uuidv4();
    }, [content]);
};