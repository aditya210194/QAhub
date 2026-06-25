import React, { useState } from 'react';

const RealWorldScenariosBlock = ({ block }) => {
    const { title, scenarios } = block;
    const [expandedScenario, setExpandedScenario] = useState(null);

    if (!scenarios || !Array.isArray(scenarios) || scenarios.length === 0) {
        return <div className="alert alert-info my-3 p-3">No scenarios available.</div>;
    }

    const getOutcomeColor = (outcome) => {
        if (outcome.includes('success') || outcome.includes('achieved')) return 'success';
        if (outcome.includes('failed') || outcome.includes('issue')) return 'danger';
        return 'warning';
    };

    return (
        <div className="real-world-scenarios-block my-4">
            {title && <h5 className="mb-4">{title}</h5>}

            <div className="accordion" id="scenariosAccordion">
                {scenarios.map((scenario, idx) => (
                    <div key={idx} className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className={`accordion-button ${expandedScenario !== idx ? 'collapsed' : ''}`}
                                type="button"
                                onClick={() => setExpandedScenario(expandedScenario === idx ? null : idx)}
                            >
                                <div className="d-flex justify-content-between w-100 me-3">
                                    <span>{scenario.scenario}</span>
                                    <span className={`badge bg-${getOutcomeColor(scenario.outcome)}`}>
                                        {scenario.outcome}
                                    </span>
                                </div>
                            </button>
                        </h2>
                        <div className={`accordion-collapse collapse ${expandedScenario === idx ? 'show' : ''}`}>
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Challenges</h6>
                                        <ul className="list-unstyled">
                                            {scenario.challenges && scenario.challenges.map((challenge, i) => (
                                                <li key={i} className="mb-2">
                                                    <i className="fas fa-exclamation-circle text-warning me-2"></i>
                                                    {challenge}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-success">Solution</h6>
                                        <ul className="list-unstyled">
                                            {scenario.solution && scenario.solution.map((sol, i) => (
                                                <li key={i} className="mb-2">
                                                    <i className="fas fa-check-circle text-success me-2"></i>
                                                    {sol}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {scenario.results && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <h6 className="text-info">Results</h6>
                                        <ul className="list-unstyled mb-0">
                                            {scenario.results.map((result, i) => (
                                                <li key={i} className="mb-1">
                                                    <i className="fas fa-star text-warning me-2"></i>
                                                    {result}
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

export default React.memo(RealWorldScenariosBlock);