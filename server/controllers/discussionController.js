const Discussion = require('../models/Discussion');

exports.getDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find().sort({ createdAt: -1 });
        res.json(discussions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createDiscussion = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const discussion = new Discussion({ title, content, author });
        await discussion.save();
        res.status(201).json(discussion);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
