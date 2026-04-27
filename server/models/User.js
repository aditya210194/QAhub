// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    experienceLevel: { type: String, default: 'Beginner' },
    skills: { type: [String], default: [] },
    links: { type: Object, default: {} },
    profilePicture: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    // 🔽 Add Q&A-specific fields
    reputation: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    resetPasswordCode: { type: String }, // Store the reset code
    resetPasswordExpires: { type: Date }, // Store the expiration time
     role: {
            type: String,
            enum: ['User', 'Mentee', 'Mentor', 'Admin'],
            default: 'User'
        },
    mentorStatus: {
           type: String,
           enum: ['Pending', 'Approved', 'Rejected'],
           default: 'Pending'
       }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;