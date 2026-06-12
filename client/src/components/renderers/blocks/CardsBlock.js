import React from 'react';

const CardsBlock = ({ block }) => {
    const { title, cards, variant = 'default', columns = 3 } = block;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>🃏 Cards</strong>
                <div className="mt-1 text-muted small">No card data available.</div>
            </div>
        );
    }

    const getColumnClass = () => {
        const colMap = { 1: 'col-12', 2: 'col-md-6', 3: 'col-md-4', 4: 'col-md-3' };
        return colMap[columns] || 'col-md-4';
    };

    const variantStyles = {
        default: { cardClass: 'shadow-sm', headerBg: 'bg-light' },
        outlined: { cardClass: 'border', headerBg: 'bg-transparent' },
        elevated: { cardClass: 'shadow-lg border-0', headerBg: 'bg-light' },
        colored: { cardClass: 'text-white', headerBg: 'bg-primary' },
    };

    const style = variantStyles[variant] || variantStyles.default;

    return (
        <div className="cards-block my-4">
            {title && <h3 className="mb-4">{title}</h3>}
            <div className="row g-4">
                {cards.map((card, idx) => (
                    <div key={idx} className={getColumnClass()}>
                        <div className={`card h-100 ${style.cardClass}`}>
                            {card.icon && (
                                <div className="card-header bg-transparent border-0 text-center pt-4">
                                    <i className={`fas ${card.icon} fa-3x text-primary`}></i>
                                </div>
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{card.title}</h5>
                                <p className="card-text text-muted">{card.description}</p>
                                {card.features && (
                                    <ul className="list-unstyled mt-3">
                                        {card.features.map((feature, i) => (
                                            <li key={i} className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {card.link && (
                                <div className="card-footer bg-transparent border-0 pb-4">
                                    <a href={card.link} className="btn btn-outline-primary">
                                        Learn More <i className="fas fa-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(CardsBlock);