// models/MentorApplication.js
const mongoose = require('mongoose');

const MentorApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: { type: String, required: true },
    experience: { type: String, required: true },
    availability: { type: String, required: true },
    bio: { type: String },
    linkedIn: { type: String },
    hourlyRate: { type: String },
    certifications: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('MentorApplication', MentorApplicationSchema);