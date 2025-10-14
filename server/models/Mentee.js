const mongoose = require("mongoose");

const MenteeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    interests: { type: [String], required: true },
    goalsShort: { type: String, required: true },
    goalsLong: { type: String },
    mentorshipType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mentee", MenteeSchema);
