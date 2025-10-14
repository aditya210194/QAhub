import React, { useState, useEffect } from 'react';
import { fetchTutorials } from '../components/services/tutorialsAPI';
import { transformApiResponse } from '../utils/tutorialUtils';

const useTutorialData = () => {
    const [contentData, setContentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const data = await fetchTutorialContent();
                setContentData(data);
            } catch (err) {
                console.error('Content fetch failed:', err);
                setError(err.message || 'Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    return { contentData, loading, error };
};

// Reusable fetch function
export const fetchTutorialContent = async () => {
    console.log('Fetching tutorials in', process.env.REACT_APP_API_MODE, 'mode');

    try {
        if (process.env.REACT_APP_API_MODE === 'local') {
            // Fetch from local JSON
            const response = await fetch(process.env.REACT_APP_LOCAL_TUTORIALS_PATH);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Local data loaded:', data);
            return transformApiResponse(data);
        }

        // Fetch from API service
        const apiResponse = await fetchTutorials();
        return transformApiResponse(apiResponse);
    } catch (error) {
        console.error('Content fetch failed:', error);
        // Return fallback structure (avoid JSX inside data!)
        return {
            "Getting Started": {
                tutorials: {
                    "Introduction to Testing": {
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
