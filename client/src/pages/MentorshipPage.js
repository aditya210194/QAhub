// MentorshipPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaComments, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const MentorshipPage = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [mentorForm, setMentorForm] = useState({
        expertise: '',
        experience: '',
        availability: '',
        linkedIn: ''
    });
    const [menteeForm, setMenteeForm] = useState({
        learningGoals: '',
        currentSkills: '',
        desiredSkills: '',
        timeCommitment: ''
    });
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Role selection handler
    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        setError('');
    };

    // Form handlers
    const handleMentorChange = (e) => {
        setMentorForm({ ...mentorForm, [e.target.name]: e.target.value });
    };

    const handleMenteeChange = (e) => {
        setMenteeForm({ ...menteeForm, [e.target.name]: e.target.value });
    };

    // Form submissions
    const handleMentorSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/mentors`, mentorForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Mentor application submitted successfully!');
            navigate('/community');
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting mentor application');
        }
    };

    const handleMenteeSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/mentees`, menteeForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Mentee registration successful!');
            navigate('/community');
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting mentee registration');
        }
    };

    // AI Chatbot handlers
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai-mentorship/chat`, {
                message: chatMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setChatHistory(prev => [
                ...prev,
                { type: 'user', content: chatMessage },
                { type: 'ai', content: response.data.reply }
            ]);
            setChatMessage('');
        } catch (err) {
            setError('Error communicating with AI mentor');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card shadow-lg p-4 rounded-4">
                        <h2 className="text-center mb-4 fw-bold text-primary">
                            <FaComments className="me-2" /> Mentorship Program
                        </h2>

                        {!selectedRole ? (
                            <div className="text-center">
                                <h4 className="mb-4">Choose Your Path</h4>
                                <div className="d-flex justify-content-center gap-4">
                                    <button
                                        className="btn btn-primary btn-lg d-flex flex-column align-items-center"
                                        onClick={() => handleRoleSelection('mentor')}
                                    >
                                        <FaChalkboardTeacher size={32} className="mb-2" />
                                        Become a Mentor
                                    </button>
                                    <button
                                        className="btn btn-success btn-lg d-flex flex-column align-items-center"
                                        onClick={() => handleRoleSelection('mentee')}
                                    >
                                        <FaUserGraduate size={32} className="mb-2" />
                                        Become a Mentee
                                    </button>
                                    <button
                                        className="btn btn-warning btn-lg d-flex flex-column align-items-center"
                                        onClick={() => handleRoleSelection('ai')}
                                    >
                                        <FaComments size={32} className="mb-2" />
                                        AI Mentorship
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {selectedRole === 'mentor' && (
                                    <form onSubmit={handleMentorSubmit}>
                                        <h4 className="mb-4"><FaChalkboardTeacher className="me-2" /> Mentor Application</h4>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Area of Expertise</label>
                                                <input type="text" className="form-control" name="expertise"
                                                       value={mentorForm.expertise} onChange={handleMentorChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Years of Experience</label>
                                                <input type="number" className="form-control" name="experience"
                                                       value={mentorForm.experience} onChange={handleMentorChange} required />
                                            </div>
                                            {/* Add more mentor fields */}
                                        </div>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <button type="button" className="btn btn-secondary"
                                                    onClick={() => setSelectedRole('')}>Back</button>
                                            <button type="submit" className="btn btn-primary">Submit Application</button>
                                        </div>
                                    </form>
                                )}

                                {selectedRole === 'mentee' && (
                                    <form onSubmit={handleMenteeSubmit}>
                                        <h4 className="mb-4"><FaUserGraduate className="me-2" /> Mentee Registration</h4>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Learning Goals</label>
                                                <textarea className="form-control" name="learningGoals"
                                                          value={menteeForm.learningGoals} onChange={handleMenteeChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Current Skills</label>
                                                <input type="text" className="form-control" name="currentSkills"
                                                       value={menteeForm.currentSkills} onChange={handleMenteeChange} required />
                                            </div>
                                            {/* Add more mentee fields */}
                                        </div>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <button type="button" className="btn btn-secondary"
                                                    onClick={() => setSelectedRole('')}>Back</button>
                                            <button type="submit" className="btn btn-success">Register as Mentee</button>
                                        </div>
                                    </form>
                                )}

                                {selectedRole === 'ai' && (
                                    <div className="ai-chat-container">
                                        <h4 className="mb-4"><FaComments className="me-2" /> AI Mentor</h4>
                                        <div className="chat-messages mb-3">
                                            {chatHistory.map((msg, index) => (
                                                <div key={index} className={`message ${msg.type} p-2 mb-2 rounded`}>
                                                    {msg.content}
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={handleChatSubmit} className="d-flex gap-2">
                                            <input type="text" className="form-control"
                                                   value={chatMessage}
                                                   onChange={(e) => setChatMessage(e.target.value)}
                                                   placeholder="Ask me anything about testing..." />
                                            <button type="submit" className="btn btn-warning">Send</button>
                                        </form>
                                        <button className="btn btn-link mt-2"
                                                onClick={() => setSelectedRole('')}>Back to Selection</button>
                                    </div>
                                )}
                            </>
                        )}

                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorshipPage;