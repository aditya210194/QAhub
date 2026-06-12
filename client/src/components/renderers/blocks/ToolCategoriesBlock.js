import React, { useState } from 'react';

const ToolCategoriesBlock = ({ block }) => {
    const { title, categories, activeCategory = 0 } = block;
    const [selectedCategory, setSelectedCategory] = useState(activeCategory);

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return <div className="alert alert-info my-2 p-3">No tool categories available.</div>;
    }

    const currentCategory = categories[selectedCategory];

    return (
        <div className="tool-categories my-4">
            {title && <h3 className="mb-3">{title}</h3>}
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        {categories.map((cat, idx) => (
                            <button key={idx} className={`list-group-item list-group-item-action ${selectedCategory === idx ? 'active' : ''}`} onClick={() => setSelectedCategory(idx)}>
                                {cat.icon && <i className={`${cat.icon} me-2`}></i>}
                                {cat.name}
                                <span className="badge bg-secondary float-end">{cat.tools?.length || 0}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">{currentCategory.name}</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {currentCategory.tools?.map((tool, idx) => (
                                    <div key={idx} className="col-md-6">
                                        <div className="tool-item d-flex align-items-start p-2 border rounded">
                                            <i className={`fas ${tool.icon || 'fa-tool'} fa-2x text-primary me-3`}></i>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{tool.name}</h6>
                                                <p className="small text-muted mb-0">{tool.description}</p>
                                                {tool.link && (
                                                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="small">
                                                        Learn more <i className="fas fa-external-link-alt ms-1"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ToolCategoriesBlock);