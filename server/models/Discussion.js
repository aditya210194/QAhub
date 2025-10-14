const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },  // Make sure this is a String, not an Object
    createdAt: { type: Date, default: Date.now },
});

const Discussion = mongoose.model('Discussion', DiscussionSchema);

module.exports = Discussion;
