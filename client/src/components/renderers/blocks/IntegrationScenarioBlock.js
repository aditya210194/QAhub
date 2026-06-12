import React from 'react';
import ContentRenderer from '../ContentRenderer';

const IntegrationScenarioBlock = ({ block, ...props }) => {
    const { title, scenario, approach, benefits, challenges, codeExample, workflow } = block;

    return (
        <div className="integration-scenario my-4">
            {title && <h3 className="mb-3">{title}</h3>}
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0"><i className="fas fa-info-circle me-2"></i>Scenario</h5>
                        </div>
                        <div className="card-body">
                            <p>{scenario}</p>
                            {workflow && (
                                <div className="mt-3">
                                    <strong>Workflow:</strong>
                                    <ol className="mt-2">
                                        {workflow.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0"><i className="fas fa-rocket me-2"></i>Solution Approach</h5>
                        </div>
                        <div className="card-body">
                            <p>{approach}</p>
                            {codeExample && (
                                <pre className="bg-dark text-light p-2 rounded mt-2 small overflow-auto">
                                    <code>{codeExample}</code>
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0"><i className="fas fa-gift me-2"></i>Benefits</h5>
                        </div>
                        <div className="card-body">
                            <ul className="mb-0">
                                {benefits?.map((benefit, i) => <li key={i}>{benefit}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0"><i className="fas fa-exclamation-triangle me-2"></i>Challenges</h5>
                        </div>
                        <div className="card-body">
                            <ul className="mb-0">
                                {challenges?.map((challenge, i) => <li key={i}>{challenge}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(IntegrationScenarioBlock);