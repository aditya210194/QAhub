const express = require('express');
const mentorshipController = require('../controllers/mentorshipController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

console.log('✅ Mentorship controller loaded successfully');
console.log('Available functions:', Object.keys(mentorshipController));

// ==================== MENTOR ROUTES ====================

// Apply to become a mentor (Any Authenticated User)
router.post('/apply-mentor', authenticate, mentorshipController.applyMentor);

// Check mentor application status (Authenticated User)
router.get('/mentor-application-status', authenticate, mentorshipController.getMentorApplicationStatus);

// Approve or Reject Mentor Application (Admin Only)
router.put('/approve-mentor/:applicationId', authenticate, authorize('Admin'), mentorshipController.approveMentor);

// List all approved mentors (Public Access)
router.get('/mentors', mentorshipController.listMentors);

// ==================== MENTEE ROUTES ====================

// Apply to become a mentee (Any Authenticated User)
router.post('/apply-mentee', authenticate, mentorshipController.applyMentee);

// Check mentee application status (Authenticated User)
router.get('/mentee-application-status', authenticate, mentorshipController.getMenteeApplicationStatus);

// Approve or Reject Mentee Application (Admin Only)
router.put('/approve-mentee/:applicationId', authenticate, authorize('Admin'), mentorshipController.approveMentee);

// ==================== ADMIN ROUTES ====================

// Get all mentor applications (Admin Only)
router.get('/admin/mentor-applications', authenticate, authorize('Admin'), mentorshipController.getAllMentorApplications);

// Get all mentee applications (Admin Only)
router.get('/admin/mentee-applications', authenticate, authorize('Admin'), mentorshipController.getAllMenteeApplications);

// ==================== MENTORSHIP REQUEST ROUTES ====================

// Request mentorship from a mentor (Mentee Only)
router.post('/request-mentorship', authenticate, authorize('Mentee'), mentorshipController.requestMentorship);

// Get mentorship requests for a specific mentor (Mentor Only)
router.get('/requests/:mentorId', authenticate, authorize('Mentor'), mentorshipController.getRequests);

// Approve mentorship request (Mentor Only)
router.put('/approve-request/:requestId', authenticate, authorize('Mentor'), mentorshipController.approveRequest);

module.exports = router;