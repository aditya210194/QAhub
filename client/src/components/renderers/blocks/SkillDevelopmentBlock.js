import React, { useState } from 'react';

const SkillDevelopmentBlock = ({ block }) => {
    const { title, skills, levels } = block;
    const [selectedLevel, setSelectedLevel] = useState('all');

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return <div className="alert alert-info my-3 p-3">No skills available.</div>;
    }

    const filteredSkills = selectedLevel === 'all'
        ? skills
        : skills.filter(skill => skill.level === selectedLevel);

    return (
        <div className="skill-development-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="btn-group mb-4" role="group">
                <button
                    className={`btn btn-outline-primary ${selectedLevel === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedLevel('all')}
                >
                    All Skills
                </button>
                {levels && levels.map((level, idx) => (
                    <button
                        key={idx}
                        className={`btn btn-outline-primary ${selectedLevel === level ? 'active' : ''}`}
                        onClick={() => setSelectedLevel(level)}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <div className="row g-4">
                {filteredSkills.map((skill, idx) => (
                    <div key={idx} className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h6 className="mb-2">{skill.skill}</h6>
                                    <span className={`badge bg-${skill.level === 'Beginner' ? 'success' : skill.level === 'Intermediate' ? 'warning' : 'danger'}`}>
                                        {skill.level}
                                    </span>
                                </div>
                                <p className="small text-muted">{skill.description}</p>

                                {skill.prerequisites && (
                                    <div className="mt-2">
                                        <strong className="small">Prerequisites:</strong>
                                        <ul className="small list-unstyled mt-1">
                                            {skill.prerequisites.map((pre, i) => (
                                                <li key={i} className="mb-1">
                                                    <i className="fas fa-arrow-right text-info me-1"></i>
                                                    {pre}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skill.resources && (
                                    <div className="mt-2">
                                        <strong className="small">Resources:</strong>
                                        <ul className="small list-unstyled mt-1">
                                            {skill.resources.map((resource, i) => (
                                                <li key={i} className="mb-1">
                                                    <i className="fas fa-book text-primary me-1"></i>
                                                    {resource}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(SkillDevelopmentBlock);