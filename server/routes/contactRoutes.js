const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController'); // Import the controller function

// POST /api/submitContactForm - Submit contact form
router.post('/submitContactForm', submitContactForm);


module.exports = router;
