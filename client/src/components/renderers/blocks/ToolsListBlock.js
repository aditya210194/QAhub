// src/components/renderers/blocks/ToolsListBlock.js
import React, { useState } from 'react';

const ToolsListBlock = ({ block, index }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { title, tools, categories, variant = 'cards' } = block;

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
        return (
            <div className="alert alert-info my-2 p-3">
                <strong>🛠️ Tools List</strong>
                <div className="mt-1 text-muted small">No tools available.</div>
            </div>
        );
    }

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getPricingBadge = (pricing) => {
        if (!pricing) return null;
        const lowerPricing = pricing.toLowerCase();
        if (lowerPricing.includes('free')) return <span className="badge bg-success ms-2">Free</span>;
        if (lowerPricing.includes('paid') || lowerPricing.includes('premium')) return <span className="badge bg-warning ms-2">Paid</span>;
        if (lowerPricing.includes('enterprise')) return <span className="badge bg-danger ms-2">Enterprise</span>;
        return <span className="badge bg-secondary ms-2">{pricing}</span>;
    };

    if (variant === 'table') {
        return (
            <div className="tools-table my-4">
                {title && <h4 className="mb-3">{title}</h4>}
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                        <tr>
                            <th>Tool</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Pricing</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTools.map((tool, idx) => (
                            <tr key={idx}>
                                <td><strong>{tool.name}</strong></td>
                                <td>{tool.description}</td>
                                <td>{tool.category || 'General'}</td>
                                <td>{getPricingBadge(tool.pricing)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Cards variant (default)
    const uniqueCategories = categories || [...new Set(tools.map(t => t.category).filter(Boolean))];

    return (
        <div className="tools-list my-4">
            {title && <h4 className="mb-3">{title}</h4>}

            {/* Search and Filter */}
            <div className="tools-controls mb-4 d-flex flex-wrap gap-2 justify-content-between">
                <div className="search-box" style={{ position: 'relative' }}>
                    <i className="fas fa-search position-absolute ms-3 mt-3 text-muted"></i>
                    <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '250px' }}
                    />
                </div>
                <div className="category-filters d-flex flex-wrap gap-2">
                    <button
                        className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {uniqueCategories.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredTools.map((tool, idx) => (
                    <div key={idx} className="col">
                        <div className="tool-card card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title mb-0">
                                        {tool.name}
                                        {getPricingBadge(tool.pricing)}
                                    </h5>
                                    {tool.rating && (
                                        <div className="rating small text-warning">
                                            {'★'.repeat(Math.floor(tool.rating))}{'☆'.repeat(5 - Math.floor(tool.rating))}
                                            <span className="text-muted ms-1">({tool.rating})</span>
                                        </div>
                                    )}
                                </div>
                                <p className="card-text text-muted small">{tool.description}</p>
                                <div className="tool-meta mt-2">
                                    {tool.category && (
                                        <span className="badge bg-light text-dark border me-1">{tool.category}</span>
                                    )}
                                    {tool.tags && tool.tags.map((tag, tagIdx) => (
                                        <span key={tagIdx} className="badge bg-light text-dark border me-1">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            {tool.link && (
                                <div className="card-footer bg-transparent border-top-0">
                                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary w-100">
                                        Learn More <i className="fas fa-external-link-alt ms-1"></i>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredTools.length === 0 && (
                <div className="text-center text-muted py-4">
                    No tools found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default React.memo(ToolsListBlock);