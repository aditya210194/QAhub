import React, { useState } from 'react';

const CategorizationBlock = ({ block }) => {
    const { title, categories, activeCategory: defaultCategory = 0 } = block;
    const [activeCategory, setActiveCategory] = useState(defaultCategory);

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return <div className="alert alert-info my-2 p-3">No categorization data available.</div>;
    }

    const currentCategory = categories[activeCategory];

    return (
        <div className="categorization-block my-4">
            {title && <h3 className="mb-3">{title}</h3>}
            <ul className="nav nav-tabs">
                {categories.map((cat, idx) => (
                    <li key={idx} className="nav-item">
                        <button className={`nav-link ${activeCategory === idx ? 'active' : ''}`} onClick={() => setActiveCategory(idx)}>
                            {cat.icon && <i className={`${cat.icon} me-2`}></i>}
                            {cat.name}
                            {cat.count && <span className="badge bg-secondary ms-2">{cat.count}</span>}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="p-3 border border-top-0 rounded-bottom">
                <div className="row g-3">
                    {currentCategory.items?.map((item, idx) => (
                        <div key={idx} className="col-md-6">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h6 className="card-title">{item.name}</h6>
                                    <p className="card-text small text-muted">{item.description}</p>
                                    {item.tags && (
                                        <div className="mt-2">
                                            {item.tags.map((tag, i) => (
                                                <span key={i} className="badge bg-light text-dark border me-1">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(CategorizationBlock);