// src/components/renderers/blocks/TimelineBlock.js
import React, { useState } from 'react';

const TimelineBlock = ({ block, index }) => {
    const [expandedEvent, setExpandedEvent] = useState(null);
    const { title, events, variant = 'vertical', interactive = false } = block;

    if (variant === 'horizontal' && events) {
        return (
            <div className="timeline-horizontal my-4">
                {title && <h4 className="mb-4 text-center">{title}</h4>}
                <div className="horizontal-timeline d-flex overflow-auto pb-3">
                    {events.map((event, idx) => (
                        <div key={idx} className="timeline-card flex-shrink-0 mx-2" style={{ width: '250px' }}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <strong>{event.date || event.year}</strong>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">{event.title}</h6>
                                    <p className="card-text small">{event.description}</p>
                                    {event.link && (
                                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                            Learn More
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="timeline-vertical my-4">
            {title && <h4 className="mb-4 text-center">{title}</h4>}
            <div className="vertical-timeline position-relative">
                {events?.map((event, idx) => (
                    <div key={idx} className="timeline-item d-flex mb-4 position-relative">
                        <div className="timeline-marker flex-shrink-0 text-center" style={{ width: '100px' }}>
                            <div className="timeline-date bg-primary text-white rounded-pill d-inline-block px-3 py-1 small">
                                {event.date || event.year}
                            </div>
                        </div>
                        <div className={`timeline-content flex-grow-1 ms-3 p-3 bg-light rounded ${interactive ? 'cursor-pointer' : ''}`}
                             onClick={() => interactive && setExpandedEvent(expandedEvent === idx ? null : idx)}
                        >
                            <h6 className="mb-2">{event.title}</h6>
                            <div className={`timeline-description ${expandedEvent !== idx && interactive ? 'line-clamp-2' : ''}`}>
                                <p className="mb-0 small">{event.description}</p>
                            </div>
                            {event.image && expandedEvent === idx && (
                                <img src={event.image} alt={event.title} className="img-fluid mt-2 rounded" style={{ maxHeight: '150px' }} />
                            )}
                            {event.link && expandedEvent === idx && (
                                <a href={event.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary mt-2">
                                    Read more <i className="fas fa-arrow-right ms-1"></i>
                                </a>
                            )}
                            {interactive && event.description?.length > 100 && (
                                <div className="text-center mt-2">
                                    <i className={`fas fa-chevron-${expandedEvent === idx ? 'up' : 'down'} text-muted`}></i>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(TimelineBlock);