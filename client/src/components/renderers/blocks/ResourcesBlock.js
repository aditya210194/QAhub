// src/components/renderers/blocks/ResourcesBlock.js
import React, { useState } from 'react';

const ResourcesBlock = ({ block, index }) => {
    const [filter, setFilter] = useState('all');
    const { title, items, categories, showFilters = true } = block;

    const filteredItems = filter === 'all' ? items : items?.filter(item => item.category === filter);

    const getResourceIcon = (type) => {
        const icons = {
            book: 'fa-book',
            video: 'fa-video',
            tool: 'fa-tools',
            article: 'fa-newspaper',
            course: 'fa-graduation-cap',
            website: 'fa-globe',  // Fixed: removed extra space
            pdf: 'fa-file-pdf',
            github: 'fa-github',
            default: 'fa-link'
        };
        return icons[type] || icons.default;
    };

    return (
        <div className="resources-block my-4">
            {title && <h4 className="mb-3">{title}</h4>}

            {showFilters && categories && categories.length > 0 && (
                <div className="resource-filters mb-3 d-flex flex-wrap gap-2">
                    <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`btn btn-sm ${filter === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            {cat.icon && <i className={`${cat.icon} me-1`}></i>}
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="row row-cols-1 row-cols-md-2 g-3">
                {filteredItems?.map((item, idx) => (
                    <div key={idx} className="col">
                        <div className="resource-card card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-start">
                                    <div className="resource-icon me-3">
                                        <i className={`fas ${getResourceIcon(item.type)} fa-2x text-primary`}></i>
                                    </div>
                                    <div className="resource-info flex-grow-1">
                                        <h6 className="resource-title mb-1">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                {item.title}
                                            </a>
                                        </h6>
                                        <p className="resource-description small text-muted mb-2">{item.description}</p>
                                        <div className="resource-meta d-flex flex-wrap gap-3 small">
                                            {item.author && <span><i className="fas fa-user me-1"></i>{item.author}</span>}
                                            {item.duration && <span><i className="fas fa-clock me-1"></i>{item.duration}</span>}
                                            {item.level && (
                                                <span className={`badge bg-${item.level === 'Beginner' ? 'success' : item.level === 'Intermediate' ? 'warning' : 'danger'}`}>
                                                    {item.level}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-top-0">
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                    Access Resource <i className="fas fa-external-link-alt ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!filteredItems || filteredItems.length === 0) && (
                <div className="text-center text-muted py-3">
                    No resources found in this category.
                </div>
            )}
        </div>
    );
};

export default React.memo(ResourcesBlock);