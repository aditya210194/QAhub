// src/components/renderers/hooks/useRendererState.js
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useRendererState = () => {
    const [collapsedSubsections, setCollapsedSubsections] = useState([]);
    const [collapsedSections, setCollapsedSections] = useState([]);
    const [copiedItems, setCopiedItems] = useState({});
    const [activeTabs, setActiveTabs] = useState({});
    const [flashcardStates, setFlashcardStates] = useState({});
    const [calculatorValues, setCalculatorValues] = useState({});
    const [retryKeys, setRetryKeys] = useState({});

    const isCollapsed = useCallback(
        (index) => collapsedSubsections.includes(index),
        [collapsedSubsections]
    );

    const isSectionCollapsed = useCallback(
        (index) => collapsedSections.includes(index),
        [collapsedSections]
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

    const toggleSectionCollapse = useCallback(
        (index) => {
            setCollapsedSections((prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        },
        []
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

    const handleRetryBlock = useCallback((blockId) => {
        setRetryKeys((prev) => ({
            ...prev,
            [blockId]: uuidv4()
        }));
    }, []);

    const updateCalculatorValue = useCallback((blockIndex, fieldIndex, value) => {
        setCalculatorValues((prev) => ({
            ...prev,
            [blockIndex]: {
                ...prev[blockIndex],
                [fieldIndex]: value
            }
        }));
    }, []);

    return {
        // State
        collapsedSubsections,
        collapsedSections,
        copiedItems,
        activeTabs,
        flashcardStates,
        calculatorValues,
        retryKeys,
        // Getters
        isCollapsed,
        isSectionCollapsed,
        // Actions
        toggleCollapse,
        toggleSectionCollapse,
        handleCopy,
        handleTabChange,
        toggleFlashcard,
        handleRetryBlock,
        updateCalculatorValue,
        setCalculatorValues
    };
};