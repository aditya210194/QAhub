const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true },
    sender: { type: String, default: 'Anonymous' },  // sender should come from frontend
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    // Optional: To track replies (if applicable)
    parentMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
});

module.exports = mongoose.model('Message', MessageSchema);
