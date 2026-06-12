const express = require('express');
const { getMessages, createMessage, deleteMessage } = require('../controllers/messageController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// Public routes (messages are viewable by anyone)
router.get('/messages/:discussionId', getMessages);

// Protected routes
router.post('/messages', authenticate, createMessage);
router.delete('/messages/:id', authenticate, deleteMessage);

module.exports = router;