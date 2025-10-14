import React from 'react';
import { Button } from 'react-bootstrap';
import { Clock, GraphUpArrow, CheckCircle, BookmarkFill } from 'react-bootstrap-icons';

const TutorialCard = ({
                          tutorial,
                          isActive,
                          onSelect,
                          isBookmarked,
                          isCompleted
                      }) => {
    return (
        <li className={`nav-item ${isActive ? 'active' : ''}`}>
            <Button
                variant="link"
                onClick={() => onSelect(tutorial.title, tutorial)}
                className="d-flex align-items-center justify-content-between w-100 text-start"
            >
                <div className="d-flex flex-column">
                    <span className="text-truncate">{tutorial.title}</span>
                    <small className="text-muted">
                        <Clock size={14} className="me-1" />
                        {tutorial.duration} •
                        <GraphUpArrow size={14} className="ms-2 me-1" />
                        {tutorial.level}
                    </small>
                </div>
                <div className="d-flex">
                    {isCompleted && <CheckCircle className="text-success me-2" size={18} />}
                    {isBookmarked && <BookmarkFill className="text-warning" size={18} />}
                </div>
            </Button>
        </li>
    );
};

export default TutorialCard;