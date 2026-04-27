const mongoose = require('mongoose');

const MenteeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mentee', MenteeSchema);