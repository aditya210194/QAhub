import React, { useState, useEffect } from 'react';
import { Toast, Offcanvas, Alert, Button, Spinner } from 'react-bootstrap';
import {Moon, Sun, XLg, Search, List, XCircle, StarFill,ArrowUp} from 'react-bootstrap-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './SoftwareTesting.css';

// Components
import TutorialHeader from '../components/Tutorials/TutorialHeader';
import CategoryAccordion from '../components/Tutorials/CategoryAccordion';
import TutorialContent from '../components/Tutorials/TutorialContent';
import TutorialsEmptyState from '../components/Tutorials/TutorialsEmptyState';
import MobileTutorialsSidebar from '../components/Tutorials/MobileTutorialsSidebar';

// Hooks
import useTutorialData from '../hooks/useTutorialData';
import useTutorialTracking from '../hooks/useTutorialTracking';

// Utils
import { filterTutorials } from '../utils/tutorialUtils';

const SoftwareTesting = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Hooks
    const { contentData, loading, error } = useTutorialData('software-testing.json');
    const {
        activeTutorial,
        recentlyViewed,
        bookmarks,
        completedTutorials,
        progress,
        trackView,
        toggleBookmark,
        toggleCompletion,
        setRecentlyViewed

    } = useTutorialTracking();

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        return () => document.body.classList.remove('dark-mode');
    }, [darkMode]);

    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleToggleBookmark = (title) => {
        toggleBookmark(title);
        showNotification(bookmarks.includes(title) ? 'Bookmark removed' : 'Bookmark added');
    };

    const handleToggleCompletion = (title) => {
        toggleCompletion(title, contentData);
        showNotification(completedTutorials.includes(title)
            ? 'Marked as incomplete'
            : 'Marked as complete'
        );
    };

    const navigateTutorial = (direction) => {
        if (!contentData || !activeTutorial) return;
        const allTutorials = Object.values(contentData)
            .flatMap(category => Object.entries(category.tutorials || {}));
        const currentIndex = allTutorials.findIndex(
            ([title]) => title === activeTutorial.title
        );
        if (currentIndex === -1) return;
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % allTutorials.length
            : (currentIndex - 1 + allTutorials.length) % allTutorials.length;
        const [title, tutorial] = allTutorials[newIndex];
        trackView(title, tutorial);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <StarFill
                key={star}
                className={`star-icon ${star <= (hoverRating || rating) ? 'active' : ''}`}
                size={24}
                onClick={() => {
                    setRating(star);
                    showNotification(`Thanks for your ${star} star rating!`);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
            />
        ));
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const filteredContent = filterTutorials(contentData, searchQuery);

    return (
        <div className={`software-testing-page ${darkMode ? 'dark-mode' : ''}`}>
            {!isOnline && (
                <Alert variant="warning" className="fixed-top">
                    You are currently offline. Some content may not be up-to-date.
                </Alert>
            )}

            <div className="floating-actions">
                <button
                    className="fab dark-mode-toggle"
                    onClick={toggleDarkMode}
                    data-tooltip={darkMode ? "Light Mode" : "Dark Mode"}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                {activeTutorial && (
                    <button
                        className="fab scroll-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        data-tooltip="Back to top"
                    >
                        <ArrowUp />
                    </button>
                )}
            </div>

            <TutorialHeader
                title="Software Testing Tutorials"
                subtitle="Comprehensive guides curated by industry experts"
                progress={progress}
            />

            <div className="container mt-4">
                <div className="row">
                    <div className="d-lg-none mb-4">
                        <div className="search-container" data-aos="fade-up">
                            <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search tutorials..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    disabled={loading || error}
                                />
                                <button
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <XLg />
                                </button>
                            </div>
                        </div>
                        <Button
                            variant="glass"
                            onClick={() => setShowMobileSidebar(true)}
                            className="w-100 d-flex align-items-center justify-content-center mt-3"
                            data-aos="fade-up"
                        >
                            <List className="me-2" /> Browse Tutorials
                        </Button>
                    </div>

                    <aside className="sidebar-col d-none d-lg-block col-lg-4">
                        <div className="sidebar-card">
                            <div className="card glass-card" data-aos="fade-right">
                                <div className="card-body">
                                    <div className="search-container mb-4">
                                        <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
                                            <Search className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Search tutorials..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setIsSearchFocused(true)}
                                                onBlur={() => setIsSearchFocused(false)}
                                                disabled={loading || error}
                                            />
                                            <button
                                                className="search-clear"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                <XLg />
                                            </button>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-4">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-2">Loading tutorials...</p>
                                        </div>
                                    ) : error ? (
                                        <Alert variant="danger">{error}</Alert>
                                    ) : (
                                        <CategoryAccordion
                                            categories={filteredContent}
                                            activeTutorialTitle={activeTutorial?.title}
                                            onSelectTutorial={trackView}
                                            bookmarks={bookmarks}
                                            completedTutorials={completedTutorials}
                                        />
                                    )}
                                </div>
                            </div>

                            {recentlyViewed.length > 0 && (
                                <div className="card glass-card" data-aos="fade-right">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Recently Viewed</h5>
                                        <ul className="recent-list">
                                            {recentlyViewed.map((item, i) => (
                                                <li key={i} className="d-flex justify-content-between align-items-center mb-2">
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-truncate text-start recent-item"
                                                        onClick={() => trackView(item.title, item.tutorial)}
                                                    >
                                                        {item.title}
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-danger ms-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRecentlyViewed(prev => prev.filter(view => view.title !== item.title));
                                                        }}
                                                    >
                                                        <XCircle size={18} />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <main className="main-content-col col-lg-8">
                        {activeTutorial ? (
                            <TutorialContent
                                activeTutorial={activeTutorial}
                                isBookmarked={bookmarks.includes(activeTutorial.title)}
                                isCompleted={completedTutorials.includes(activeTutorial.title)}
                                onToggleBookmark={() => handleToggleBookmark(activeTutorial.title)}
                                onToggleCompletion={() => handleToggleCompletion(activeTutorial.title)}
                                navigateTutorial={navigateTutorial}
                                renderStars={renderStars}
                            />
                        ) : (
                            <TutorialsEmptyState
                                onShowMobileSidebar={() => setShowMobileSidebar(true)}
                            />
                        )}
                    </main>
                </div>
            </div>

            <MobileTutorialsSidebar
                show={showMobileSidebar}
                onHide={() => setShowMobileSidebar(false)}
                categories={filteredContent}
                activeTutorialTitle={activeTutorial?.title}
                onSelectTutorial={trackView}
                bookmarks={bookmarks}
                completedTutorials={completedTutorials}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearchFocused={isSearchFocused}
                setIsSearchFocused={setIsSearchFocused}
                loading={loading}
                error={error}
                recentlyViewed={recentlyViewed}
                onRemoveRecentlyViewed={(title) => {
                    setRecentlyViewed(prev => prev.filter(item => item.title !== title));
                }}
            />

            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                className="position-fixed bottom-0 end-0 m-3 glass-toast"
                delay={3000}
                autohide
            >
                <Toast.Header className="bg-primary text-white">
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default SoftwareTesting;