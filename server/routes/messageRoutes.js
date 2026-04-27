const express = require('express');
const { getMessages, createMessage } = require('../controllers/messageController');

const router = express.Router();

// API to create a message
router.post('/messages', createMessage);

// API to get messages for a discussion
router.get('/messages/:discussionId', getMessages);

module.exports = router;
