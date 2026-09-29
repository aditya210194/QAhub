import React from 'react';
import { Button } from 'react-bootstrap';
import { BookmarkFill, Clock, PlayCircle } from 'react-bootstrap-icons';

const TutorialsEmptyState = ({ onShowMobileSidebar, title = 'Software Testing', lessonCount = 0, categoryCount = 0 }) => {
    return (
        <div className="empty-state text-center py-5" data-aos="fade-up">
            <div className="empty-icon mb-4">
                <div className="icon-bg">
                    <BookmarkFill size={48} className="text-primary" />
                </div>
            </div>
            <h3 className="mb-3">{title} Tutorials</h3>
            <p className="text-muted mb-4">
                Select a tutorial from the sidebar to begin learning. Our comprehensive guides cover everything from basic concepts to advanced automation techniques.
            </p>
            {lessonCount > 0 && (
                <div className="stats-grid d-flex justify-content-center mb-4 flex-wrap">
                    <div className="stat-card">
                        <Clock size={24} className="mb-2" />
                        <h4>{lessonCount}</h4>
                        <p>Lessons</p>
                    </div>
                    <div className="stat-card">
                        <PlayCircle size={24} className="mb-2" />
                        <h4>{categoryCount}</h4>
                        <p>Topics</p>
                    </div>
                </div>
            )}
            <Button
                variant="glass"
                onClick={onShowMobileSidebar}
                className="d-lg-none mt-3"
            >
                Browse Tutorials
            </Button>
        </div>
    );
};

export default TutorialsEmptyState;