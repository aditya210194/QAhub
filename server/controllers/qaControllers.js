const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const mongoose = require("mongoose");
const path = require("path");

// Get all questions with improved sorting
exports.getAllQuestions = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        const skip = (page - 1) * limit;

        let sortOption = {};
        switch(sort) {
            case 'newest': sortOption = { createdAt: -1 }; break;
            case 'mostAnswered': sortOption = { answersCount: -1 }; break;
            case 'unanswered': sortOption = { answersCount: 1 }; break;
            case 'trending': sortOption = { trendingScore: -1 }; break;
            default: sortOption = { createdAt: -1 };
        }

        const [questions, total] = await Promise.all([
            Question.find()
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('user', 'username fullName profilePicture')
                .lean(),
            Question.countDocuments()
        ]);

        res.json({
            questions,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// In qaController.js - getQuestionById
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('user', 'username fullName profilePicture reputation')
            .lean();

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const answers = await Answer.find({ questionId: req.params.id })
            .sort({ upvotes: -1, createdAt: -1 })
            .populate('user', 'username fullName profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username fullName' }
            })
            .lean();

        // Increment view count asynchronously
        Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

        res.json({ ...question, answers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Ask a question
exports.askQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const newQuestion = new Question({
            title,
            description,
            tags,
            user: req.user.id
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: "Error posting question" });
    }
};

// Answer a question
exports.answerQuestion = async (req, res) => {
    try {
        const { answerText } = req.body;
        const files = req.files || [];

        if (!answerText || answerText.trim().length < 10) {
            return res.status(400).json({ error: 'Answer must be at least 10 characters' });
        }

        const fileUrls = files.map(file => {
            return process.env.NODE_ENV === 'production'
                ? file.location
                : `/uploads/${file.filename}`;
        });

        const answer = new Answer({
            questionId: req.params.id,
            answerText,
            files: fileUrls,
            user: req.user.id
        });

        await answer.save();

        await Question.findByIdAndUpdate(req.params.id, {
            $push: { answers: answer._id },
            $inc: { answersCount: 1 }
        });

        res.status(201).json(answer);
    } catch (err) {
        console.error('Error posting answer:', err);
        res.status(500).json({ error: err.message });
    }
};

// Add comment to a question
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const answerId = req.params.id;

        if (!text || text.trim().length < 1) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const comment = new Comment({
            answerId,
            text,
            user: req.user.id
        });

        await comment.save();

        await Answer.findByIdAndUpdate(answerId, {
            $push: { comments: comment._id }
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'username fullName')
            .lean();

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error('Error posting comment:', err);
        res.status(500).json({ error: err.message });
    }
};

// Vote on a question
exports.voteAnswer = async (req, res) => {
    try {
        const { voteType } = req.body; // 'up' or 'down'
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        const existingVote = await Vote.findOne({
            answerId: req.params.id,
            user: req.user.id
        });

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // Remove vote
                await existingVote.deleteOne();
                if (voteType === 'up') answer.upvotes -= 1;
                else answer.downvotes -= 1;
            } else {
                // Change vote
                if (voteType === 'up') {
                    answer.upvotes += 1;
                    answer.downvotes -= 1;
                } else {
                    answer.upvotes -= 1;
                    answer.downvotes += 1;
                }
                existingVote.voteType = voteType;
                await existingVote.save();
            }
        } else {
            // New vote
            await Vote.create({
                answerId: req.params.id,
                user: req.user.id,
                voteType
            });
            if (voteType === 'up') answer.upvotes += 1;
            else answer.downvotes += 1;
        }

        await answer.save();
        res.json({ upvotes: answer.upvotes, downvotes: answer.downvotes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Vote on an answer
exports.voteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) return res.status(404).json({ error: "Answer not found" });

        const existingVote = await Vote.findOne({
            answerId: req.params.id,
            user: req.user.id
        });

        if (existingVote) {
            // Update existing vote
            if (existingVote.voteType !== req.body.voteType) {
                answer.upvotes += req.body.voteType === 'up' ? 2 : -2;
                existingVote.voteType = req.body.voteType;
                await existingVote.save();
            }
        } else {
            // New vote
            answer.upvotes += req.body.voteType === 'up' ? 1 : -1;
            await Vote.create({
                answerId: req.params.id,
                user: req.user.id,
                voteType: req.body.voteType
            });
        }

        await answer.save();
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: "Error voting" });
    }
};

// File Upload with MIME type check
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Determine the file URL based on the environment
        let fileUrl;
        if (process.env.NODE_ENV === 'production') {
            // For production (AWS S3), use the file location provided by multer-s3
            fileUrl = req.file.location;
        } else {
            // For local testing, construct the file URL manually
            fileUrl = `/uploads/${req.file.filename}`;
        }

        res.json({
            message: "File uploaded successfully",
            fileUrl
        });
    } catch (err) {
        res.status(500).json({ error: "Error uploading file" });
    }
};