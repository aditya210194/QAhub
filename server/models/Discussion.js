const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messageCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp on save
DiscussionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for better search performance
DiscussionSchema.index({ title: 'text', content: 'text', description: 'text' });
DiscussionSchema.index({ createdAt: -1 });
DiscussionSchema.index({ likes: -1 });
DiscussionSchema.index({ messageCount: -1 });

const Discussion = mongoose.model('Discussion', DiscussionSchema);

module.exports = Discussion;