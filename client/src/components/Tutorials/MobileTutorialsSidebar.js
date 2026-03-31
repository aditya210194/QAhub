import React from 'react';
import {Offcanvas, Accordion, Badge, Alert, Button, Spinner} from 'react-bootstrap';
import { XLg, Search,XCircle } from 'react-bootstrap-icons';
import TutorialCard from '../TutorialCard';

const MobileTutorialsSidebar = ({
                                    show,
                                    onHide,
                                    categories,
                                    activeTutorialTitle,
                                    onSelectTutorial,
                                    bookmarks,
                                    completedTutorials,
                                    searchQuery,
                                    setSearchQuery,
                                    isSearchFocused,
                                    setIsSearchFocused,
                                    loading,
                                    error,
                                    recentlyViewed,
                                    onRemoveRecentlyViewed
                                }) => {
    return (
        <Offcanvas show={show} onHide={onHide} placement="start" className="mobile-sidebar">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Tutorial Categories</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
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
                    <Accordion>
                        {Object.entries(categories).map(([topic, categoryData], idx) => (
                            <Accordion.Item eventKey={String(idx)} key={idx} className="mb-2">
                                <Accordion.Header>
                                    <div className="d-flex flex-column">
                                        <span className="accordion-title">{topic}</span>
                                        {categoryData.description && (
                                            <small className="text-muted">{categoryData.description}</small>
                                        )}
                                    </div>
                                    <Badge bg="primary" className="ms-2">
                                        {Object.keys(categoryData.tutorials).length}
                                    </Badge>
                                </Accordion.Header>
                                <Accordion.Body className="p-1">
                                    <ul className="tutorial-list">
                                        {Object.entries(categoryData.tutorials).map(([title, tutorial]) => (
                                            <TutorialCard
                                                key={title}
                                                tutorial={{ title, ...tutorial }}
                                                isActive={activeTutorialTitle === title}
                                                isBookmarked={bookmarks.includes(title)}
                                                isCompleted={completedTutorials.includes(title)}
                                                onSelect={onSelectTutorial}
                                            />
                                        ))}
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}

                {recentlyViewed.length > 0 && (
                    <div className="mt-4">
                        <h5 className="mb-3">Recently Viewed</h5>
                        <ul className="recent-list">
                            {recentlyViewed.map((item, i) => (
                                <li key={i} className="d-flex justify-content-between align-items-center mb-2">
                                    <Button
                                        variant="link"
                                        className="p-0 text-truncate text-start recent-item"
                                        onClick={() => onSelectTutorial(item.title, item.tutorial)}
                                    >
                                        {item.title}
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="p-0 text-danger ms-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveRecentlyViewed(item.title);
                                        }}
                                    >
                                        <XCircle size={18} />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default MobileTutorialsSidebar;