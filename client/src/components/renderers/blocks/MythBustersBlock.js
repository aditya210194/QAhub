// src/components/renderers/blocks/MythBustersBlock.js
import React, { useState } from 'react';

const MythBustersBlock = ({ block, index }) => {
    const [flippedCards, setFlippedCards] = useState({});
    const { title, items, variant = 'cards', showReality = true } = block;

    const toggleCard = (cardIndex) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardIndex]: !prev[cardIndex]
        }));
    };

    const variantStyles = {
        cards: 'grid',
        list: 'list',
        table: 'table',
    };

    if (variant === 'list') {
        return (
            <div className="myth-busters-list my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="list-group">
                    {items?.map((item, idx) => (
                        <div key={idx} className="list-group-item">
                            <div className="myth mb-2">
                                <strong className="text-danger">❌ Myth:</strong> {item.myth}
                            </div>
                            {showReality && (
                                <div className="reality">
                                    <strong className="text-success">✅ Reality:</strong> {item.reality}
                                </div>
                            )}
                            {item.explanation && (
                                <div className="explanation mt-2 small text-muted">
                                    {item.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'table') {
        return (
            <div className="myth-busters-table my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Myth</th>
                            {showReality && <th>Reality</th>}
                            <th>Explanation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items?.map((item, idx) => (
                            <tr key={idx}>
                                <td className="text-danger"><strong>{item.myth}</strong></td>
                                {showReality && <td className="text-success">{item.reality}</td>}
                                <td className="text-muted small">{item.explanation || item.reality}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Default: cards variant
    return (
        <div className="myth-busters-cards my-4">
            {title && <h4 className="mb-3 text-center">{title}</h4>}
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {items?.map((item, idx) => {
                    const isFlipped = flippedCards[idx];
                    return (
                        <div key={idx} className="col">
                            <div
                                className={`myth-card card h-100 shadow-sm cursor-pointer ${isFlipped ? 'border-success' : ''}`}
                                onClick={() => toggleCard(idx)}
                            >
                                {!isFlipped ? (
                                    <div className="card-body text-center">
                                        <div className="myth-icon mb-3">
                                            <i className="fas fa-times-circle text-danger fa-3x"></i>
                                        </div>
                                        <h5 className="card-title text-danger">Myth</h5>
                                        <p className="card-text">{item.myth}</p>
                                        <small className="text-muted">Click to reveal reality</small>
                                    </div>
                                ) : (
                                    <div className="card-body text-center">
                                        <div className="reality-icon mb-3">
                                            <i className="fas fa-check-circle text-success fa-3x"></i>
                                        </div>
                                        <h5 className="card-title text-success">Reality</h5>
                                        <p className="card-text">{item.reality}</p>
                                        {item.explanation && (
                                            <div className="explanation mt-2 small text-muted">
                                                {item.explanation}
                                            </div>
                                        )}
                                        <small className="text-muted">Click to flip back</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(MythBustersBlock);