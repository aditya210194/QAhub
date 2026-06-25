import React, { useState } from 'react';

const ToolsCategorizationBlock = ({ block }) => {
    const { categories } = block;
    const [selectedCategory, setSelectedCategory] = useState(null);

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return <div className="alert alert-info my-3 p-3">No tool categories available.</div>;
    }

    return (
        <div className="tools-categorization-block my-4">
            <ul className="nav nav-tabs mb-4">
                {categories.map((category, idx) => (
                    <li className="nav-item" key={idx}>
                        <button
                            className={`nav-link ${selectedCategory === idx ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
                        >
                            {category.category}
                        </button>
                    </li>
                ))}
            </ul>

            {categories.map((category, idx) => (
                <div key={idx} className={selectedCategory === idx ? 'd-block' : 'd-none'}>
                    <p className="text-muted">{category.description}</p>

                    <div className="row g-4">
                        {category.tools && category.tools.map((tool, toolIdx) => (
                            <div key={toolIdx} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-header bg-primary text-white">
                                        <h6 className="mb-0">{tool.name}</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-2">
                                            <span className="badge bg-info me-2">Accuracy: {tool.accuracy}</span>
                                            <span className="badge bg-secondary">{tool['pricing-tier']}</span>
                                        </div>

                                        <div className="mb-2">
                                            <strong className="small">AI Capabilities:</strong>
                                            <ul className="small list-unstyled mt-1">
                                                {tool['ai-capabilities'] && tool['ai-capabilities'].map((cap, i) => (
                                                    <li key={i} className="mb-1">
                                                        <i className="fas fa-microchip text-primary me-1"></i>
                                                        {cap}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <strong className="small">Key Features:</strong>
                                            <ul className="small list-unstyled mt-1">
                                                {tool['key-features'] && tool['key-features'].map((feature, i) => (
                                                    <li key={i} className="mb-1">
                                                        <i className="fas fa-check text-success me-1"></i>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default React.memo(ToolsCategorizationBlock);