const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // Reference to Answer model
    answersCount: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

questionSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model("Question", questionSchema);