export const transformApiResponse = (apiData) => {
    const transformed = {};
    const categories = apiData.categories || [];

    categories.forEach(category => {
        transformed[category.name] = {
            description: category.description || '',
            tutorials: {}
        };

        const tutorials = category.tutorials || [];
        tutorials.forEach(tutorial => {
            transformed[category.name].tutorials[tutorial.title] = {
                id: tutorial.id || tutorial.title,
                level: tutorial.difficulty || 'Beginner',
                duration: `${tutorial.duration || 30} min`,
                rating: `${tutorial.rating || 90}% Rating`,
                author: tutorial.author || 'Unknown',
                lastUpdated: tutorial.last_updated || 'Unknown',
                content: tutorial.content,
                case_studies: tutorial.case_studies,
                ...tutorial
            };
        });
    });

    return transformed;
};

export const getLevelBadge = (level) => {
    switch((level || '').toLowerCase()) {
        case 'beginner': return 'primary';
        case 'intermediate': return 'warning';
        case 'advanced': return 'danger';
        default: return 'secondary';
    }
};

export const filterTutorials = (contentData, searchQuery) => {
    if (!contentData) return {};
    return Object.entries(contentData).reduce((acc, [topic, categoryData]) => {
        const filteredTutorials = Object.entries(categoryData.tutorials || {}).filter(([title]) =>
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredTutorials.length > 0) {
            acc[topic] = {
                ...categoryData,
                tutorials: Object.fromEntries(filteredTutorials)
            };
        }
        return acc;
    }, {});
};