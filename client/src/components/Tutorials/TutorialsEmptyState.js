import React from 'react';
import { Button } from 'react-bootstrap';
import { BookmarkFill, Clock, PlayCircle, Check2Circle } from 'react-bootstrap-icons';

const TutorialsEmptyState = ({ onShowMobileSidebar }) => {
    return (
        <div className="empty-state text-center py-5" data-aos="fade-up">
            <div className="empty-icon mb-4">
                <div className="icon-bg">
                    <BookmarkFill size={48} className="text-primary" />
                </div>
            </div>
            <h3 className="mb-3">Software Testing Tutorials</h3>
            <p className="text-muted mb-4">
                Select a tutorial from the sidebar to begin learning. Our comprehensive guides cover everything from basic concepts to advanced automation techniques.
            </p>
            <div className="stats-grid d-flex justify-content-center mb-4 flex-wrap">
                <div className="stat-card">
                    <Clock size={24} className="mb-2" />
                    <h4>50+</h4>
                    <p>Tutorials</p>
                </div>
                <div className="stat-card">
                    <PlayCircle size={24} className="mb-2" />
                    <h4>100+</h4>
                    <p>Practical Examples</p>
                </div>
                <div className="stat-card">
                    <Check2Circle size={24} className="mb-2" />
                    <h4>98%</h4>
                    <p>User Satisfaction</p>
                </div>
            </div>
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