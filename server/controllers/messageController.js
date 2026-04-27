// controllers/messageController.js

const Message = require('../models/Message');

// Existing function to retrieve messages
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ discussionId: req.params.discussionId })
            .sort({ createdAt: 1 });  // Sort messages in ascending order of creation time

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// New function to create and save a message
exports.createMessage = async (req, res) => {
    const { discussionId, sender, text } = req.body;

    if (!discussionId || !text) {
        return res.status(400).json({ error: 'Discussion ID and text are required.' });
    }

    try {
        const newMessage = new Message({
            discussionId,
            sender: sender || 'Anonymous', // Default to 'Anonymous' if sender is missing
            text,
            createdAt: new Date(), // Explicitly set the timestamp
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
};
