const mongoose = require('mongoose');

const MenteeApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learningGoals: {
        type: String,
        required: true
    },
    currentSkills: {
        type: String,
        required: true
    },
    desiredSkills: {
        type: String,
        required: true
    },
    timeCommitment: {
        type: String,
        required: true
    },
    preferredLanguage: {
        type: String
    },
    background: {
        type: String
    },
    expectations: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenteeApplication', MenteeApplicationSchema);