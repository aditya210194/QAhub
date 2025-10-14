const express = require('express');
const { getAiMentorResponse } = require('../controllers/aiMentorController');

const router = express.Router();

console.log("getAiMentorResponse:", getAiMentorResponse); // Debugging log

// Ensure the function is properly used
router.post('/response', async (req, res) => {
    console.log("POST /api/ai-mentor/response called"); // Debugging log
    await getAiMentorResponse(req, res);
});

module.exports = router;
