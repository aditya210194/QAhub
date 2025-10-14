import React from 'react';
import { Accordion, Badge } from 'react-bootstrap';
import TutorialCard from '../TutorialCard';

const CategoryAccordion = ({
                               categories,
                               activeTutorialTitle,
                               onSelectTutorial,
                               bookmarks,
                               completedTutorials
                           }) => {
    return (
        <Accordion defaultActiveKey="0">
            {Object.entries(categories).map(([topic, categoryData], idx) => (
                <Accordion.Item eventKey={String(idx)} key={idx} className="mb-2 glass-accordion">
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
    );
};

export default CategoryAccordion;