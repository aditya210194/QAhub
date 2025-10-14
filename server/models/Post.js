const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    codeBlocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodeBlock' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    votes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);