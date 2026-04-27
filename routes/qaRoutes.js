const express = require("express");
const router = express.Router();
const qaController = require("../controllers/qaControllers");
const { authenticate, isAdmin } = require('../middleware/authenticate');
const upload = require("../utils/fileUpload");

router.get("/questions", qaController.getAllQuestions);
router.get("/questions/:id", qaController.getQuestionById);
router.post("/questions", authenticate, qaController.askQuestion);
router.post("/questions/:id/answers", authenticate, upload.array('files'), qaController.answerQuestion);
router.post("/answers/:id/vote", authenticate, qaController.voteAnswer);
router.post("/answers/:id/comment", authenticate, qaController.addComment);
router.post("/upload", authenticate, upload.single("file"), qaController.uploadFile);

module.exports = router;