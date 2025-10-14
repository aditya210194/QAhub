const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const mongoose = require("mongoose");
const path = require("path");

// Get all questions with improved sorting
exports.getAllQuestions = async (req, res) => {
    try {
        const { sort = "newest", page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const sortOptions = {
            newest: { createdAt: -1 },
            mostAnswered: { answersCount: -1 },
            unanswered: { answersCount: 1 },
            trending: { trendingScore: -1 }
        };

        const [questions, total] = await Promise.all([
            Question.find()
                .sort(sortOptions[sort] || sortOptions.newest)
                .skip(skip)
                .limit(parseInt(limit))
                .populate("user", "username"),
            Question.countDocuments()
        ]);

        res.json({
            questions,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching questions" });
    }
};

// In qaController.js - getQuestionById
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate("user", "username");

        if (!question) return res.status(404).json({ error: "Question not found" });

        // Fetch answers and populate comments + user details
        const answers = await Answer.find({ questionId: req.params.id })
            .populate({
                path: "comments",
                select: "text user createdAt", // Explicitly include fields
                populate: {
                    path: "user",
                    model: "User", // Ensure model is specified
                    select: "username"
                }
            })
            .populate("user", "username");

        // Debugging: Check if comments are populated correctly
        if (answers.length > 0 && answers[0].comments.length > 0) {
            console.log("Sample Comment:", {
                text: answers[0].comments[0].text,
                user: answers[0].comments[0].user
            });
        }

        // Combine question and answers with proper comment structure
        const populatedQuestion = {
            ...question.toObject(),
            answers: answers.map(answer => ({
                ...answer.toObject(),
                comments: answer.comments.map(comment => ({
                    ...comment.toObject(),
                    user: comment.user // Already populated from the query
                }))
            }))
        };

        res.json(populatedQuestion);
    } catch (err) {
        console.error("Error fetching question:", err);
        res.status(500).json({ error: "Error fetching question" });
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
        const files = req.files; // Array of uploaded files

        // Determine file URLs based on the environment
        const fileUrls = files ? files.map(file => {
            return process.env.NODE_ENV === 'production' ? file.location : `/uploads/${file.filename}`;
        }) : [];

        const answer = new Answer({
            questionId: req.params.id,
            answerText,
            files: fileUrls, // Store file URLs
            user: req.user.id
        });

        await answer.save();

        // Push the answer's _id into the question's answers array
        await Question.findByIdAndUpdate(req.params.id, {
            $push: { answers: answer._id },
            $inc: { answersCount: 1 } // Increment the answersCount
        });

        res.status(201).json(answer);
    } catch (err) {
        res.status(500).json({ error: "Error posting answer" });
    }
};

// Add comment to a question
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body; // Ensure this matches the frontend payload
        const answerId = req.params.id; // Get the answer ID from the URL
        const userId = req.user.id; // Get the user ID from the authenticated request

        console.log("Request Body:", req.body); // Debugging
        console.log("Answer ID:", answerId); // Debugging
        console.log("User ID:", userId); // Debugging

        // Validate input
        if (!text || !answerId || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new comment
        const comment = new Comment({
            answerId: answerId,
            text: text, // Ensure this field is included
            user: userId // Ensure this field is included
        });

        // Save the comment to the database
        await comment.save();

        // Update the answer to include the comment
        await Answer.findByIdAndUpdate(answerId, {
            $push: { comments: comment._id }
        });

        res.status(201).json(comment);
    } catch (err) {
        console.error("Error posting comment:", err);
        res.status(500).json({ error: "Error posting comment", details: err.message });
    }
};

// Vote on a question
exports.voteQuestion = async (req, res) => {
    try {
        const { voteType } = req.body; // 'up' or 'down'
        const vote = await Vote.findOneAndUpdate(
            { questionId: req.params.id, user: req.user.id },
            { voteType },
            { upsert: true, new: true }
        );
        res.json(vote);
    } catch (err) {
        res.status(500).json({ error: "Error voting" });
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