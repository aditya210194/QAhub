const Discussion = require('../models/Discussion');
const Message = require('../models/Message');

// Get all discussions with sorting and search
exports.getDiscussions = async (req, res) => {
    try {
        const { sort = 'newest', search = '' } = req.query;

        let sortOption = {};
        let query = {};

        // Search filter
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Sort options
        switch(sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'mostActive':
                sortOption = { messageCount: -1 };
                break;
            case 'popular':
                sortOption = { likes: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const discussions = await Discussion.find(query)
            .sort(sortOption)
            .lean();

        res.json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single discussion by ID
exports.getDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id)
            .lean();

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        res.json(discussion);
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create new discussion
exports.createDiscussion = async (req, res) => {
    try {
        const { title, content, description, author, authorId } = req.body;

        const discussion = new Discussion({
            title,
            content,
            description: description || content,
            author,
            authorId: authorId || null
        });

        await discussion.save();
        res.status(201).json(discussion);
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update discussion
exports.updateDiscussion = async (req, res) => {
    try {
        const { title, content, description } = req.body;

        const discussion = await Discussion.findByIdAndUpdate(
            req.params.id,
            { title, content, description, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        res.json(discussion);
    } catch (error) {
        console.error('Error updating discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete discussion
exports.deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findByIdAndDelete(req.params.id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        // Also delete all messages in this discussion
        await Message.deleteMany({ discussionId: req.params.id });

        res.json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        console.error('Error deleting discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Like/Unlike discussion
exports.toggleLike = async (req, res) => {
    try {
        const userId = req.user?.id;
        const discussion = await Discussion.findById(req.params.id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const hasLiked = discussion.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike
            discussion.likes -= 1;
            discussion.likedBy = discussion.likedBy.filter(id => id.toString() !== userId);
        } else {
            // Like
            discussion.likes += 1;
            discussion.likedBy.push(userId);
        }

        await discussion.save();

        res.json({
            likes: discussion.likes,
            likedByUser: !hasLiked
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Increment message count
exports.incrementMessageCount = async (discussionId) => {
    try {
        await Discussion.findByIdAndUpdate(discussionId, {
            $inc: { messageCount: 1 },
            updatedAt: Date.now()
        });
    } catch (error) {
        console.error('Error incrementing message count:', error);
    }
};