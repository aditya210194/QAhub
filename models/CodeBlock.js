const mongoose = require('mongoose');

const CodeBlockSchema = new mongoose.Schema({
    code: { type: String, required: true },
    language: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CodeBlock', CodeBlockSchema);