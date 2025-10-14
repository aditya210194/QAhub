import { useState, useCallback } from 'react';

const useTutorialTracking = () => {
    const [activeTutorial, setActiveTutorial] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [completedTutorials, setCompletedTutorials] = useState([]);
    const [progress, setProgress] = useState(0);

    const trackView = useCallback((title, tutorial) => {
        setActiveTutorial({ id: tutorial.id, title, ...tutorial });
        setRecentlyViewed(prev => [
            { title, timestamp: new Date().toISOString(), tutorial },
            ...prev.filter(item => item.title !== title).slice(0, 4)
        ]);
    }, []);

    const toggleBookmark = useCallback((title) => {
        setBookmarks(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    }, []);

    const toggleCompletion = useCallback((title, contentData) => {
        setCompletedTutorials(prev => {
            const newCompleted = prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title];

            // Calculate progress
            if (contentData) {
                const totalTutorials = Object.values(contentData).reduce(
                    (acc, category) => acc + Object.keys(category.tutorials || {}).length,
                    0
                );
                setProgress(Math.round((newCompleted.length / totalTutorials) * 100));
            }

            return newCompleted;
        });
    }, []);

    return {
        activeTutorial,
        recentlyViewed,
        bookmarks,
        completedTutorials,
        progress,
        trackView,
        toggleBookmark,
        toggleCompletion
    };
};

export default useTutorialTracking;