import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DiscussionForums.css'; // We'll create this CSS file

const socket = io(process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000');

const DiscussionForum = () => {
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newDiscussionTopic, setNewDiscussionTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const token = sessionStorage.getItem('token');

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                const user = JSON.parse(storedUser);
                setUsername(user.username || user.fullName || 'Anonymous');
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                sessionStorage.removeItem('user');
                setIsLoggedIn(false);
            }
        } else {
            if (token) {
                fetchUserProfile(token);
            }
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const userData = await response.json();
                sessionStorage.setItem('user', JSON.stringify(userData));
                setUsername(userData.username || userData.fullName || 'Anonymous');
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) return;

        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/discussions`)
            .then((res) => res.json())
            .then((data) => {
                setDiscussions(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching discussions:", error);
                setLoading(false);
            });
    }, [isLoggedIn]);

    useEffect(() => {
        if (!selectedDiscussion) return;

        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/messages/${selectedDiscussion._id}`)
            .then((res) => res.json())
            .then((messages) => {
                setMessages(Array.isArray(messages) ? messages : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
                setLoading(false);
            });

        socket.emit("joinDiscussion", selectedDiscussion._id);
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => Array.isArray(prevMessages) ? [...prevMessages, message] : [message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [selectedDiscussion]);

    const sendMessage = () => {
        if (newMessage.trim() && selectedDiscussion) {
            const messageData = {
                discussionId: selectedDiscussion._id,
                sender: username || 'Anonymous',
                text: newMessage,
                createdAt: new Date().toISOString(),
            };
            socket.emit('sendMessage', messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        }
    };

    const handleCreateDiscussion = async () => {
        if (newDiscussionTopic.trim()) {
            const newDiscussion = {
                title: newDiscussionTopic,
                content: 'This is the content of the new discussion',
                author: username || 'Anonymous',
                createdAt: new Date(),
            };
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/discussions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDiscussion),
                });
                if (response.ok) {
                    const data = await response.json();
                    socket.emit('new-discussion', data);
                    setDiscussions((prevDiscussions) => [...prevDiscussions, data]);
                    setNewDiscussionTopic('');
                    setShowCreateModal(false);
                }
            } catch (error) {
                console.error('Error creating new discussion:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";

        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredDiscussions = discussions.filter(discussion =>
        discussion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isLoggedIn) {
        return (
            <div className="discussion-forum-container">
                <div className="login-prompt">
                    <div className="login-prompt-content">
                        <i className="bi bi-chat-dots display-1 mb-4"></i>
                        <h2>Join the Conversation</h2>
                        <p className="mb-4">Please log in to participate in discussions and connect with the community.</p>
                        <a href="/login" className="btn btn-primary btn-lg">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Log In to Continue
                        </a>
                    </div>
                </div>
            </div>
        );
    }

     const renderInfoBox = () => (
            <div className="info-box mb-4">
                <div className="info-box-icon">
                    <i className="bi bi-info-circle-fill"></i>
                </div>
                <div className="info-box-content">
                    <h5 className="info-box-title">Welcome to the QA Discussion Forum</h5>
                    <p className="info-box-text">
                        This is your space to connect with fellow QA professionals, ask questions,
                        share knowledge, and collaborate on testing challenges. Whether you're a beginner
                        or an expert, your voice matters here. Start a discussion, join existing ones,
                        and help build a vibrant community.
                    </p>
                    <ul className="info-box-list">
                        <li><i className="bi bi-chat-text-fill"></i> Ask technical questions</li>
                        <li><i className="bi bi-lightbulb-fill"></i> Share insights and best practices</li>
                        <li><i className="bi bi-people-fill"></i> Network with peers and mentors</li>
                        <li><i className="bi bi-trophy-fill"></i> Earn reputation and badges</li>
                    </ul>
                </div>
            </div>
        );

    return (
        <div className="discussion-forum-container">
            {/* Header Section */}
            <div className="forum-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="forum-title">
                                <i className="bi bi-chat-dots-fill me-3"></i>
                                Discussion Forum
                            </h1>
                            <p className="forum-subtitle">Connect, share ideas, and learn from the community</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <button
                                className="btn btn-light btn-lg create-discussion-btn"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Start New Discussion
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container forum-content">
                <div className="row">
                {/* Info Box - placed above sidebar on small screens, beside sidebar on larger screens */}
              <div className="col-12 mb-4 d-lg-none">{renderInfoBox()}</div>
                    {/* Discussions Sidebar */}
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="discussions-sidebar">
                         <div className="d-none d-lg-block mb-4">
                                                        {renderInfoBox()}
                                                    </div>
                            <div className="sidebar-header">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">
                                        <i className="bi bi-chat-text me-2"></i>
                                        All Discussions
                                    </h5>
                                    <span className="discussion-count">{filteredDiscussions.length} topics</span>
                                </div>
                                <div className="search-box">
                                    <i className="bi bi-search search-icon"></i>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search discussions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="discussions-list">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : filteredDiscussions.length > 0 ? (
                                    filteredDiscussions.map((discussion) => (
                                        <div
                                            key={discussion._id}
                                            className={`discussion-item ${selectedDiscussion?._id === discussion._id ? 'active' : ''}`}
                                            onClick={() => setSelectedDiscussion(discussion)}
                                        >
                                            <div className="discussion-item-content">
                                                <h6 className="discussion-title">{discussion.title || "Untitled"}</h6>
                                                <div className="discussion-meta">
                                                    <span className="discussion-author">
                                                        <i className="bi bi-person-circle me-1"></i>
                                                        {discussion.author}
                                                    </span>
                                                    <span className="discussion-date">
                                                        <i className="bi bi-clock me-1"></i>
                                                        {formatDate(discussion.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <i className="bi bi-chevron-right discussion-arrow"></i>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="bi bi-inbox display-4 text-muted"></i>
                                        <p className="text-muted mt-3">No discussions found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="col-lg-8">
                        <div className="chat-container">
                            {selectedDiscussion ? (
                                <>
                                    <div className="chat-header">
                                        <div className="d-flex align-items-center">
                                            <div className="chat-avatar">
                                                <i className="bi bi-person-circle fs-3"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h5 className="mb-1">{selectedDiscussion.title}</h5>
                                                <div className="chat-meta">
                                                    <small className="text-muted">
                                                        <i className="bi bi-person me-1"></i>
                                                        Started by {selectedDiscussion.author}
                                                    </small>
                                                    <small className="text-muted ms-3">
                                                        <i className="bi bi-clock me-1"></i>
                                                        {formatDate(selectedDiscussion.createdAt)}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messages-container" id="messagesContainer">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message-wrapper ${msg.sender === username ? 'sent' : 'received'}`}
                                            >
                                                <div className="message-bubble">
                                                    <div className="message-header">
                                                        <strong>{msg.sender}</strong>
                                                        <small className="message-time">
                                                            {formatDate(msg.createdAt)}
                                                        </small>
                                                    </div>
                                                    <p className="message-text mb-0">{msg.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {messages.length === 0 && (
                                            <div className="text-center py-5">
                                                <i className="bi bi-chat display-1 text-muted"></i>
                                                <p className="text-muted mt-3">No messages yet. Start the conversation!</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="chat-input-area">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message here..."
                                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={sendMessage}
                                                disabled={!newMessage.trim()}
                                            >
                                                <i className="bi bi-send me-2"></i>
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="no-chat-selected">
                                    <div className="text-center">
                                        <i className="bi bi-chat-dots display-1 text-muted mb-4"></i>
                                        <h4 className="text-muted">Select a Discussion</h4>
                                        <p className="text-muted">Choose a topic from the left to start participating</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Discussion Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-plus-circle me-2"></i>
                                Start New Discussion
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowCreateModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Discussion Topic</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    value={newDiscussionTopic}
                                    onChange={(e) => setNewDiscussionTopic(e.target.value)}
                                    placeholder="Enter your discussion topic..."
                                    autoFocus
                                />
                                <small className="text-muted mt-2 d-block">
                                    Choose a clear and descriptive title for your discussion
                                </small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleCreateDiscussion}
                                disabled={!newDiscussionTopic.trim()}
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Create Discussion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscussionForum;