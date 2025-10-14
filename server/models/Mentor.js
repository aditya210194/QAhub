const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    linkedin: { type: String },
    expertise: { type: [String], required: true },
    experience: { type: String, required: true },
    availability: { type: String, required: true },
    bio: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mentor", MentorSchema);
