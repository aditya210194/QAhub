const express = require("express");
const router = express.Router();
const qaController = require("../controllers/qaControllers");
const { authenticate } = require('../middleware/authenticate');
const upload = require("../utils/fileUpload");
const { cacheMiddleware } = require('../middleware/cache'); // Add cache for GET endpoints

// ==================== PUBLIC ROUTES (with caching) ====================
// Get all questions - cached for 5 minutes
router.get("/questions", cacheMiddleware(300), qaController.getAllQuestions);

// Get single question by ID - cached for 5 minutes
router.get("/questions/:id", cacheMiddleware(300), qaController.getQuestionById);

// ==================== PROTECTED ROUTES (require authentication) ====================
// Ask a new question
router.post("/questions", authenticate, qaController.askQuestion);

// Post an answer to a question (with file upload support)
router.post("/questions/:id/answers", authenticate, upload.array('files', 5), qaController.answerQuestion);

// Vote on an answer
router.post("/answers/:id/vote", authenticate, qaController.voteAnswer);

// Add comment to an answer
router.post("/answers/:id/comment", authenticate, qaController.addComment);

// Upload file (general purpose)
router.post("/upload", authenticate, upload.single("file"), qaController.uploadFile);

// ==================== ADMIN ROUTES (optional - add if needed) ====================
// router.delete("/questions/:id", authenticate, isAdmin, qaController.deleteQuestion);
// router.delete("/answers/:id", authenticate, isAdmin, qaController.deleteAnswer);

module.exports = router;