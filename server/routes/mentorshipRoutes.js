const express = require('express');
const {
    listMentors,
    requestMentorship,
    getRequests,
    approveRequest,
    applyMentor,
    approveMentor
} = require('../controllers/mentorshipController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize'); // Middleware for role-based access

const router = express.Router();

// ✅ Apply to become a mentor (Any Authenticated User)
router.post('/apply-mentor', authenticate, applyMentor);

// ✅ Approve or Reject Mentor Application (Admin Only)
router.put('/approve-mentor/:applicationId', authenticate, authorize('Admin'), approveMentor);

// ✅ List all approved mentors (Public Access)
router.get('/mentors', listMentors);

// ✅ Request mentorship from a mentor (Mentee Only)
router.post('/request-mentorship', authenticate, authorize('Mentee'), requestMentorship);

// ✅ Get mentorship requests for a specific mentor (Mentor Only)
router.get('/requests/:mentorId', authenticate, authorize('Mentor'), getRequests);

// ✅ Approve mentorship request (Mentor Only)
router.put('/approve-request/:requestId', authenticate, authorize('Mentor'), approveRequest);

module.exports = router;
