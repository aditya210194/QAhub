// src/components/renderers/hooks/useBlockNavigation.js
import { useCallback, useState } from 'react';

export const useBlockNavigation = () => {
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [blockHistory, setBlockHistory] = useState([]);

    const navigateToBlock = useCallback((index, blocks) => {
        if (index >= 0 && index < blocks.length) {
            setBlockHistory(prev => [...prev, currentBlockIndex]);
            setCurrentBlockIndex(index);
            // Scroll to top of block
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentBlockIndex]);

    const goBack = useCallback(() => {
        if (blockHistory.length > 0) {
            const previousIndex = blockHistory[blockHistory.length - 1];
            setBlockHistory(prev => prev.slice(0, -1));
            setCurrentBlockIndex(previousIndex);
        }
    }, [blockHistory]);

    const goToNext = useCallback((blocks) => {
        if (currentBlockIndex < blocks.length - 1) {
            navigateToBlock(currentBlockIndex + 1, blocks);
        }
    }, [currentBlockIndex, navigateToBlock]);

    const goToPrevious = useCallback((blocks) => {
        if (currentBlockIndex > 0) {
            navigateToBlock(currentBlockIndex - 1, blocks);
        }
    }, [currentBlockIndex, navigateToBlock]);

    const resetNavigation = useCallback(() => {
        setCurrentBlockIndex(0);
        setBlockHistory([]);
    }, []);

    return {
        currentBlockIndex,
        blockHistory,
        canGoBack: blockHistory.length > 0,
        navigateToBlock,
        goBack,
        goToNext,
        goToPrevious,
        resetNavigation
    };
};