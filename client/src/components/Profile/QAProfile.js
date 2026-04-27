import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserQAProfile = () => {
    const { username } = useParams(); // Get username from URL
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [qaActivity, setQaActivity] = useState({
        questions: [],
        answers: [],
        upvotes: 0,
    });
    const [activeTab, setActiveTab] = useState('questions'); // Default tab

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/${username}`);
                setProfile(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        const fetchQAActivity = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/qa/profile/${username}`);
                setQaActivity(response.data);
            } catch (err) {
                console.error('Error fetching Q&A activity:', err);
            }
        };

        fetchProfile();
        fetchQAActivity();
    }, [username]);
    const getProfileImageUrl = (profilePicture) => {
        if (!profilePicture) return '/default-profile-pic.jpg';

        if (profilePicture.startsWith('http')) {
            return profilePicture;
        }

        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

        let imagePath = profilePicture.replace(/\\/g, '/');

        if (imagePath.includes('uploads/')) {
            return `${baseUrl}/${imagePath}`;
        }

        return `${baseUrl}/uploads/profile_pictures/${imagePath.split('/').pop()}`;
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body text-center">
                    <img
                      src={getProfileImageUrl(profile.profilePicture)}
                      alt="Profile"
                      width={100}
                      className="rounded-circle mb-3"
                      onError={(e) => {
                        e.target.src = '/default-profile-pic.jpg';
                      }}
                    />
                    <h4>{profile.username}</h4>
                    <p><strong>Reputation:</strong> {profile.reputation || 0}</p>

                    {/* Badges */}
                    {profile.badges && profile.badges.length > 0 && (
                        <div>
                            <strong>Badges:</strong> {profile.badges.join(', ')}
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className="mt-3">
                        <p><strong>Questions Asked:</strong> {qaActivity.questions.length}</p>
                        <p><strong>Answers Provided:</strong> {qaActivity.answers.length}</p>
                        <p><strong>Upvotes Received:</strong> {qaActivity.upvotes}</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mt-4">
                        <button className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('questions')}>Questions Asked</button>
                        <button className={`btn ${activeTab === 'answers' ? 'btn-primary' : 'btn-outline-primary'} ms-2`} onClick={() => setActiveTab('answers')}>Answers Provided</button>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-3">
                        {activeTab === 'questions' && (
                            <ul className="list-group">
                                {qaActivity.questions.map((q) => (
                                    <li key={q._id} className="list-group-item">
                                        <a href={`/qa/question/${q._id}`}>{q.title}</a> - {q.upvotes} upvotes
                                    </li>
                                ))}
                            </ul>
                        )}

                        {activeTab === 'answers' && (
                            <ul className="list-group">
                                {qaActivity.answers.map((a) => (
                                    <li key={a._id} className="list-group-item">
                                        <a href={`/qa/question/${a.questionId}`}>{a.answerText}</a> - {a.upvotes} upvotes
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserQAProfile;
