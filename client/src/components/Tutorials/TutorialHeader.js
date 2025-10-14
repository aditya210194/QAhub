import React from 'react';
import { Trophy } from 'react-bootstrap-icons';

const TutorialHeader = ({
                            title = "Software Testing Tutorials",
                            subtitle = "Comprehensive guides curated by industry experts",
                            progress
                        }) => {
    return (
        <header className="tutorials-header" data-aos="fade-down">
            <div className="container">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="header-title">
                            <Trophy className="me-3" />
                            {title}
                        </h1>
                        <p className="header-subtitle">{subtitle}</p>
                    </div>
                    <div className="header-right">
                        <div className="progress-indicator">
                            <div className="progress-label">
                                Learning Progress: <span>{progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TutorialHeader;