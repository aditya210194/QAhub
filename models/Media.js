const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    format: { type: String, enum: ['image', 'embed'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', MediaSchema);