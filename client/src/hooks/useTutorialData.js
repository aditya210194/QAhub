import React, { useState, useEffect } from 'react';
import { fetchTutorials } from '../components/services/tutorialsAPI';
import { transformApiResponse } from '../utils/tutorialUtils';

const useTutorialData = (fileName = 'software-testing.json') => {
    const [contentData, setContentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const data = await fetchTutorialContent(fileName);
                setContentData(data);
            } catch (err) {
                console.error('Content fetch failed:', err);
                setError(err.message || 'Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [fileName]);

    return { contentData, loading, error };
};

// Reusable fetch function
export const fetchTutorialContent = async (fileName = 'software-testing.json') => {
    console.log('Fetching tutorials in', process.env.REACT_APP_API_MODE, 'mode');

    try {
        if (process.env.REACT_APP_API_MODE === 'local') {
            const response = await fetch(`/data/${fileName}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Local data loaded:', fileName);
            return transformApiResponse(data);
        }

        const apiResponse = await fetchTutorials(fileName);
        return transformApiResponse(apiResponse);

    } catch (error) {
        console.error('Content fetch failed:', error);
        return {
            "Getting Started": {
                tutorials: {
                    "Introduction": {
                        id: "intro",
                        level: "Beginner",
                        duration: "10 min",
                        rating: "95% Rating",
                        content: `Failed to load content. Error: ${error.message}`
                    }
                }
            }
        };
    }
};


export default useTutorialData;
