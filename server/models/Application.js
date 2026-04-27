const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Add your schema fields here based on your requirements
  // Example fields:
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  status: { type: String, default: 'pending' },
  appliedDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);