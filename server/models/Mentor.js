// models/Mentor.js
const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    linkedIn: { type: String },
    expertise: { type: [String], required: true },
    experience: { type: String, required: true },
    availability: { type: String, required: true },
    bio: { type: String },
    hourlyRate: { type: String },
    certifications: { type: [String] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mentor", MentorSchema);