const express = require('express');
const mentorshipController = require('../controllers/mentorshipController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize'); // No destructuring needed since it exports a function directly

const router = express.Router();

console.log('✅ Mentorship controller loaded successfully');
console.log('Available functions:', Object.keys(mentorshipController));
console.log('authenticate type:', typeof authenticate);
console.log('authorize type:', typeof authorize);
console.log('authorize("Admin") type:', typeof authorize('Admin'));

// ✅ Apply to become a mentor (Any Authenticated User)
router.post('/apply-mentor', authenticate, mentorshipController.applyMentor);

// ✅ Approve or Reject Mentor Application (Admin Only)
router.put('/approve-mentor/:applicationId', authenticate, authorize('Admin'), mentorshipController.approveMentor);

// ✅ List all approved mentors (Public Access)
router.get('/mentors', mentorshipController.listMentors);

// ✅ Request mentorship from a mentor (Mentee Only)
router.post('/request-mentorship', authenticate, authorize('Mentee'), mentorshipController.requestMentorship);

// ✅ Get mentorship requests for a specific mentor (Mentor Only)
router.get('/requests/:mentorId', authenticate, authorize('Mentor'), mentorshipController.getRequests);

// ✅ Approve mentorship request (Mentor Only)
router.put('/approve-request/:requestId', authenticate, authorize('Mentor'), mentorshipController.approveRequest);

module.exports = router;