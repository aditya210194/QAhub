const Message = require('../models/Message');
const { incrementMessageCount } = require('./discussionController');

// Get messages for a discussion
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ discussionId: req.params.discussionId })
            .sort({ createdAt: 1 })
            .lean();

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new message
exports.createMessage = async (req, res) => {
    const { discussionId, sender, text, senderId } = req.body;

    if (!discussionId || !text) {
        return res.status(400).json({ error: 'Discussion ID and text are required.' });
    }

    try {
        const newMessage = new Message({
            discussionId,
            sender: sender || 'Anonymous',
            senderId: senderId || null,
            text,
            createdAt: new Date(),
        });

        const savedMessage = await newMessage.save();

        // Increment message count for the discussion
        await incrementMessageCount(discussionId);

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Server error' });
    }
};