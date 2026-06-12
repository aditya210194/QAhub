// src/components/renderers/hooks/useImageLoader.js
import { useState, useEffect, useCallback } from 'react';

export const useImageLoader = (src, fallbackImage) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);

        // Start with the original src
        setImageSrc(src);
    }, [src]);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
        if (fallbackImage && imageSrc !== fallbackImage) {
            setImageSrc(fallbackImage);
        }
    }, [fallbackImage, imageSrc]);

    return {
        imageSrc,
        isLoading,
        hasError,
        handleLoad,
        handleError
    };
};