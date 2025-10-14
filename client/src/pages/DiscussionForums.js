import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io(process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000');

const DiscussionForum = () => {
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newDiscussionTopic, setNewDiscussionTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login status

    useEffect(() => {
        // Check if the user is logged in on mount
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username || user.fullName || 'Anonymous');
            setIsLoggedIn(true); // User is logged in
        } else {
            setIsLoggedIn(false); // User is not logged in
        }
    }, []); // This useEffect runs only once when the component mounts

    useEffect(() => {
        if (!isLoggedIn) return; // Early exit if the user is not logged in

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
    }, [isLoggedIn]); // Only trigger this effect when login status changes

    useEffect(() => {
        if (!selectedDiscussion) return; // Exit if no discussion is selected

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
    }, [selectedDiscussion]); // This useEffect depends on the selected discussion

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
                } else {
                    console.error('Error creating discussion');
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
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    if (!isLoggedIn) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-warning">
                    Please log in to participate in the discussions.
                </div>
            </div>
        );
    }

    return (
        <div className="discussion-forum-container container-fluid py-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-header bg-dark text-white text-center">
                            <h4>Discussions</h4>
                        </div>
                        <div className="card-body">
                            {loading ? <div className="spinner-border text-primary" role="status"></div> : (
                                <ul className="list-group list-group-flush">
                                    {discussions.map((discussion) => (
                                        <li
                                            key={discussion._id}
                                            className={`list-group-item d-flex justify-content-between align-items-center ${selectedDiscussion?._id === discussion._id ? 'bg-info text-white' : ''}`}
                                            onClick={() => setSelectedDiscussion(discussion)}
                                        >
                                            <div>
                                                <h5 className="mb-0">{discussion.title || "Untitled"}</h5>
                                                <small>Started by {discussion.author} on {formatDate(discussion.createdAt)}</small>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="mt-3">
                                <h5>Create New Discussion</h5>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newDiscussionTopic}
                                        onChange={(e) => setNewDiscussionTopic(e.target.value)}
                                        placeholder="Enter topic"
                                        disabled={!isLoggedIn} // Disable input if not logged in
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCreateDiscussion}
                                        disabled={!isLoggedIn || !newDiscussionTopic.trim()} // Disable if not logged in or input is empty
                                    >
                                        <i className="bi bi-plus-circle"></i> Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-header bg-dark text-white">
                            {selectedDiscussion ? <h5>{selectedDiscussion.title}</h5> : <h5>Select a discussion</h5>}
                        </div>
                        <div className="card-body">
                            {loading && !selectedDiscussion ? <div className="spinner-border text-primary" role="status"></div> : (
                                selectedDiscussion && (
                                    <div className="messages-container overflow-auto" style={{ maxHeight: '400px' }}>
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message-item ${msg.sender === username ? 'sent' : 'received'}`}
                                            >
                                                <strong>{msg.sender}</strong>
                                                <p>{msg.text}</p>
                                                <small>{formatDate(msg.createdAt)}</small>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                            {selectedDiscussion && (
                                <div className="input-group mt-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Write a message"
                                        disabled={!isLoggedIn} // Disable input if not logged in
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim() || !selectedDiscussion || !isLoggedIn} // Disable if not logged in
                                    >
                                        Send
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscussionForum;
