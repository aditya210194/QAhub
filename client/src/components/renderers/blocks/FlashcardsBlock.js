import React, { useState } from 'react';

const FlashcardsBlock = ({ block, index }) => {
    const [flippedStates, setFlippedStates] = useState({});

    const toggleFlip = (cardIndex) => {
        setFlippedStates(prev => ({ ...prev, [cardIndex]: !prev[cardIndex] }));
    };

    return (
        <div className="flashcards-container my-4">
            {block.title && <h4 className="mb-4">{block.title}</h4>}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {block.cards?.map((card, i) => (
                    <div key={i} className="col">
                        <div className={`flashcard card h-100 shadow-sm cursor-pointer ${flippedStates[i] ? 'border-primary' : ''}`} onClick={() => toggleFlip(i)}>
                            <div className="card-body d-flex flex-column justify-content-center text-center" style={{ minHeight: '180px' }}>
                                {!flippedStates[i] ? (
                                    <>
                                        <i className="fas fa-question-circle text-primary fa-2x mb-2"></i>
                                        <p className="mb-0">{card.front || card.question}</p>
                                        <small className="text-muted mt-2">Click to reveal answer</small>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-lightbulb text-success fa-2x mb-2"></i>
                                        <p className="mb-0">{card.back || card.answer}</p>
                                        <small className="text-muted mt-2">Click to flip back</small>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(FlashcardsBlock);