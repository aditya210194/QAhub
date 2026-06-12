import { useState, useEffect, useRef } from 'react';
import { fetchTutorials } from '../components/services/tutorialsAPI';
import { transformApiResponse } from '../utils/tutorialUtils';

const useTutorialData = (fileName = 'software-testing.json') => {
    const [contentData, setContentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const previousFileName = useRef(fileName);

    useEffect(() => {
        // Only fetch if fileName actually changed
        if (previousFileName.current !== fileName) {
            console.log('🔄 fileName changed from', previousFileName.current, 'to', fileName);
            previousFileName.current = fileName;
        }

        let isMounted = true;

        const loadContent = async () => {
            console.log('📥 Loading content for:', fileName);
            setLoading(true);
            setContentData(null);
            setError(null);

            try {
                const timestamp = Date.now();
                const data = await fetchTutorialContent(fileName, timestamp);
                if (isMounted) {
                    console.log('✅ Setting contentData for:', fileName);
                    setContentData(data);
                }
            } catch (err) {
                console.error('❌ Error for', fileName, ':', err);
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadContent();

        return () => {
            isMounted = false;
        };
    }, [fileName]); // This dependency is critical

    return { contentData, loading, error };
};

export const fetchTutorialContent = async (fileName, timestamp) => {
    console.log('🌐 Fetching file:', fileName);

    const cacheBuster = timestamp || Date.now();

    // Ensure we're using the correct path
    const filePath = `/data/${fileName}?t=${cacheBuster}`;
    console.log('📍 Fetching from:', filePath);

    try {
        const response = await fetch(filePath, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('📄 Raw data keys:', Object.keys(data));
        return transformApiResponse(data);
    } catch (error) {
        console.error('❌ Fetch failed:', error);
        throw error;
    }
};

export default useTutorialData;