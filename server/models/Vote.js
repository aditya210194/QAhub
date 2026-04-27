const mongoose = require('mongoose');

const Vote = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    voteType: { type: String, enum: ["up", "down"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', Vote);