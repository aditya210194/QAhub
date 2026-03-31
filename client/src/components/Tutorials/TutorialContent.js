import React from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import {
    Bookmark, BookmarkFill, CheckCircle, Check2Circle,
    Share, ArrowLeft, ArrowRight, ArrowUp,
    Lightning, StarFill,Clock,GraphUpArrow,Person
} from 'react-bootstrap-icons';
import ContentRenderer from '../ContentRenderer';

const TutorialContent = ({
                             activeTutorial,
                             isBookmarked,
                             isCompleted,
                             onToggleBookmark,
                             onToggleCompletion,
                             navigateTutorial,
                             rating,
                             setRating,
                             hoverRating,
                             setHoverRating,
                             showNotification
                         }) => {
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
    return (
        <div className="tutorial-content-card">
            <Card className="glass-card" data-aos="fade-up">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                        {/* Breadcrumb and title */}
                        <div className="mb-3 mb-md-0">
                            <div className="breadcrumb mb-2">
                                <span>Home</span>
                                <span className="divider">/</span>
                                <span>Tutorials</span>
                                <span className="divider">/</span>
                                <span className="current">{activeTutorial.title}</span>
                            </div>
                            <h2 className="card-title">{activeTutorial.title}</h2>
                            <div className="tutorial-meta d-flex flex-wrap gap-3 mt-2">
                <span className="text-muted">
                  <Clock size={14} className="me-1" />
                    {activeTutorial.duration}
                </span>
                                <span className="text-muted">
                  <GraphUpArrow size={14} className="me-1" />
                                    {activeTutorial.level}
                </span>
                                {activeTutorial.author && (
                                    <span className="text-muted">
                    <Person size={14} className="me-1" />
                                        {activeTutorial.author}
                  </span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="d-flex action-buttons">
                            <Button
                                variant={isBookmarked ? 'primary' : 'glass'}
                                className="me-2 action-btn"
                                onClick={onToggleBookmark}
                                title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                            >
                                {isBookmarked ? <BookmarkFill size={18} /> : <Bookmark size={18} />}
                            </Button>
                            <Button
                                variant={isCompleted ? 'success' : 'glass'}
                                className="me-2 action-btn"
                                onClick={onToggleCompletion}
                                title={isCompleted ? 'Completed' : 'Mark as complete'}
                            >
                                {isCompleted ? <Check2Circle size={18} /> : <CheckCircle size={18} />}
                            </Button>
                            <Button
                                variant="glass"
                                className="action-btn"
                                title="Share"
                            >
                                <Share size={18} />
                            </Button>
                        </div>
                    </div>

                    <div id="tutorial-content">
                        <ContentRenderer
                            content={activeTutorial.content}
                            contentType={activeTutorial.contentType}
                        />

                        {/* Case studies */}
                        {activeTutorial.case_studies && (
                            <div className="case-studies mt-5">
                                <h4 className="mb-4">
                                    <Lightning className="me-2 text-warning" />
                                    Real-World Case Studies
                                </h4>
                                {activeTutorial.case_studies.map((study, index) => (
                                    <div key={index} className="case-study-card mb-4 p-4 bg-light rounded">
                                        <h5>{study.title}</h5>
                                        <p><strong>Challenge:</strong> {study.challenge}</p>
                                        <p><strong>Solution:</strong> {study.solution}</p>
                                        <p><strong>Outcome:</strong> {study.outcome}</p>
                                        {study.metrics && (
                                            <div className="metrics-table mt-3">
                                                <table className="table table-bordered">
                                                    <thead>
                                                    <tr>
                                                        <th>Metric</th>
                                                        <th>Before</th>
                                                        <th>After</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {study.metrics.map((metric, i) => (
                                                        <tr key={i}>
                                                            <td>{metric.name}</td>
                                                            <td>{metric.before}</td>
                                                            <td>{metric.after}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="content-footer mt-5 pt-4">
                        <div className="d-flex justify-content-between flex-wrap">
                            <Button
                                variant="glass"
                                onClick={() => navigateTutorial('prev')}
                                className="d-flex align-items-center me-2 mb-2"
                            >
                                <ArrowLeft className="me-2" /> Previous
                            </Button>
                            <Button
                                variant="glass"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="back-to-top me-2 mb-2"
                            >
                                <ArrowUp className="me-1" /> Back to Top
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => navigateTutorial('next')}
                                className="d-flex align-items-center mb-2"
                            >
                                Next <ArrowRight className="ms-2" />
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="glass-card mt-4" data-aos="fade-up">
                <Card.Body>
                    <h4 className="card-title mb-4">
                        <StarFill className="me-2 text-warning" />
                        Rate this tutorial
                    </h4>
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="rating-stars me-3 mb-2">
                            {renderStars}
                        </div>
                        <Button variant="primary" disabled={rating === 0}>
                            Submit Rating
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TutorialContent;