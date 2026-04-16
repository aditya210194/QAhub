import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaCheck, FaBan, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './AdminPages.css';

const MentorApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/mentorship/admin/mentor-applications`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/mentorship/approve-mentor/${id}`,
                { status: action === 'approve' ? 'Approved' : 'Rejected' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchApplications();
        } catch (error) {
            console.error('Error updating application:', error);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Pending':
                return <span className="status-badge pending"><FaClock /> Pending</span>;
            case 'Approved':
                return <span className="status-badge approved"><FaCheckCircle /> Approved</span>;
            case 'Rejected':
                return <span className="status-badge rejected"><FaTimesCircle /> Rejected</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    if (loading) return <div className="admin-loading">Loading applications...</div>;

    return (
        <div className="admin-page">
            <h1>Mentor Applications</h1>
            <div className="applications-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Expertise</th>
                            <th>Experience</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app._id}>
                                <td>{app.userId?.fullName || 'N/A'}</td>
                                <td>{app.userId?.email || 'N/A'}</td>
                                <td>{app.expertise}</td>
                                <td>{app.experience} years</td>
                                <td>{getStatusBadge(app.status)}</td>
                                <td className="action-buttons">
                                    <button
                                        className="btn-view"
                                        onClick={() => {
                                            setSelectedApp(app);
                                            setShowModal(true);
                                        }}
                                    >
                                        <FaEye /> View
                                    </button>
                                    {app.status === 'Pending' && (
                                        <>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleAction(app._id, 'approve')}
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleAction(app._id, 'reject')}
                                            >
                                                <FaBan /> Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && selectedApp && (
                <div className="admin-modal" onClick={() => setShowModal(false)}>
                    <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Application Details</h3>
                            <button onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="admin-modal-body">
                            <p><strong>Name:</strong> {selectedApp.userId?.fullName}</p>
                            <p><strong>Email:</strong> {selectedApp.userId?.email}</p>
                            <p><strong>Expertise:</strong> {selectedApp.expertise}</p>
                            <p><strong>Experience:</strong> {selectedApp.experience} years</p>
                            <p><strong>Availability:</strong> {selectedApp.availability} hours/week</p>
                            <p><strong>LinkedIn:</strong> <a href={selectedApp.linkedIn} target="_blank" rel="noopener noreferrer">{selectedApp.linkedIn}</a></p>
                            <p><strong>Bio:</strong> {selectedApp.bio}</p>
                            {selectedApp.certifications && <p><strong>Certifications:</strong> {selectedApp.certifications}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorApplications;