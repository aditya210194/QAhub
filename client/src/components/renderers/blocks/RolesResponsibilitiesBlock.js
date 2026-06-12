import React, { useState } from 'react';

const RolesResponsibilitiesBlock = ({ block }) => {
    const { title, roles, variant = 'cards' } = block;
    const [selectedRole, setSelectedRole] = useState(null);

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return <div className="alert alert-info my-2 p-3">No roles data available.</div>;
    }

    if (variant === 'matrix') {
        return (
            <div className="roles-matrix my-4">
                {title && <h3 className="mb-3">{title}</h3>}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr><th>Role</th><th>Responsibilities</th><th>Skills Required</th><th>Seniority</th></tr>
                        </thead>
                        <tbody>
                        {roles.map((role, idx) => (
                            <tr key={idx}>
                                <td><strong>{role.name}</strong></td>
                                <td>{role.responsibilities?.join(', ')}</td>
                                <td>{role.skills?.join(', ')}</td>
                                <td><span className={`badge bg-${role.seniority === 'Senior' ? 'danger' : role.seniority === 'Junior' ? 'success' : 'warning'}`}>{role.seniority}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="roles-cards my-4">
            {title && <h3 className="mb-4 text-center">{title}</h3>}
            <div className="row g-4">
                {roles.map((role, idx) => (
                    <div key={idx} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">{role.name}</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <strong>Responsibilities:</strong>
                                    <ul className="mt-2 mb-0 small">
                                        {role.responsibilities?.slice(0, selectedRole === idx ? undefined : 3).map((resp, i) => (
                                            <li key={i}>{resp}</li>
                                        ))}
                                        {role.responsibilities?.length > 3 && selectedRole !== idx && (
                                            <li className="text-primary cursor-pointer" onClick={() => setSelectedRole(idx)}>+ {role.responsibilities.length - 3} more...</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="mb-3">
                                    <strong>Required Skills:</strong>
                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                        {role.skills?.map((skill, i) => (
                                            <span key={i} className="badge bg-light text-dark border">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className={`badge bg-${role.seniority === 'Senior' ? 'danger' : role.seniority === 'Junior' ? 'success' : 'warning'}`}>{role.seniority}</span>
                                    {role.salary && <small className="text-muted">{role.salary}</small>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(RolesResponsibilitiesBlock);