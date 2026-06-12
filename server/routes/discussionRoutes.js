const express = require('express');
const {
    getDiscussions,
    createDiscussion,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion,
    toggleLike
} = require('../controllers/discussionController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.get('/discussions', getDiscussions);
router.get('/discussions/:id', getDiscussionById);

// Protected routes (require authentication)
router.post('/discussions', authenticate, createDiscussion);
router.put('/discussions/:id', authenticate, updateDiscussion);
router.delete('/discussions/:id', authenticate, deleteDiscussion);
router.post('/discussions/:id/like', authenticate, toggleLike);

module.exports = router;