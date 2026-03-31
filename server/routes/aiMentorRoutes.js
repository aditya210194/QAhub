// routes/aiMentorRoutes.js
const express = require('express');
const {
    getAiMentorResponse,
    getAiMentorResponseWithFiles,
    getAiConversation,
    deleteAiConversation
} = require('../controllers/aiMentorController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// AI Mentor chat endpoints
router.post('/response', authenticate, getAiMentorResponse);
router.post('/response-with-files', authenticate, getAiMentorResponseWithFiles);
router.get('/conversation', authenticate, getAiConversation);
router.delete('/conversation', authenticate, deleteAiConversation);

module.exports = router;