// controllers/mentorshipController.js
const User = require('../models/User');
const MentorApplication = require('../models/MentorApplication');
const Mentor = require("../models/Mentor");
const MentorshipRequest = require('../models/MentorshipRequest');
const nodemailer = require('nodemailer');

let io;

const setSocketIO = (socketInstance) => {
    io = socketInstance;
};

// ✅ Apply to become a mentor
const applyMentor = async (req, res) => {
    try {
        const { expertise, experience, availability, bio, linkedIn, hourlyRate, certifications } = req.body;
        
        // Create new mentor application
        const newApplication = new MentorApplication({
            userId: req.user.id,
            expertise,
            experience,
            availability,
            bio,
            linkedIn,
            hourlyRate,
            certifications,
            status: 'Pending'
        });
        
        await newApplication.save();
        
        res.status(201).json({ 
            message: 'Mentor application submitted successfully',
            application: newApplication 
        });
    } catch (error) {
        console.error('Error in applyMentor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve or Reject Mentor Application (Admin Only)
const approveMentor = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await MentorApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update application status
        application.status = status;
        await application.save();

        if (status === 'Approved') {
            const user = await User.findById(application.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user role to Mentor
            user.role = 'Mentor';
            user.mentorStatus = 'Approved';
            await user.save();

            // Create Mentor profile
            const newMentor = new Mentor({
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                linkedIn: application.linkedIn,
                expertise: application.expertise,
                experience: application.experience,
                availability: application.availability,
                bio: application.bio,
                hourlyRate: application.hourlyRate,
                certifications: application.certifications
            });
            await newMentor.save();

            // Send email notification
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: { 
                    user: process.env.EMAIL_USER, 
                    pass: process.env.EMAIL_PASS 
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Mentor Application Approved',
                html: `
                    <h2>Congratulations!</h2>
                    <p>Your application to become a mentor has been approved.</p>
                    <p>You can now start accepting mentorship requests from students.</p>
                    <a href="${process.env.FRONTEND_URL}/mentorship">Visit Mentorship Page</a>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.json({ message: `Mentor application ${status} successfully` });
    } catch (error) {
        console.error('Error in approveMentor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ List all approved mentors
const listMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().populate('userId', 'username fullName email profilePicture');
        res.json(mentors);
    } catch (error) {
        console.error('Error in listMentors:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Request mentorship from a mentor
const requestMentorship = async (req, res) => {
    try {
        const { mentorId, message } = req.body;
        const menteeId = req.user.id;

        // Check if mentee exists
        const mentee = await User.findById(menteeId);
        if (!mentee) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if mentor exists and is approved
        const mentor = await User.findOne({ _id: mentorId, role: 'Mentor', mentorStatus: 'Approved' });
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            mentorId,
            menteeId,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'You already have a pending or approved request with this mentor' });
        }

        // Update user role to Mentee if not already
        if (mentee.role !== 'Mentee' && mentee.role !== 'Mentor') {
            mentee.role = 'Mentee';
            await mentee.save();
        }

        // Create mentorship request
        const newRequest = new MentorshipRequest({
            mentorId,
            menteeId,
            message: message || '',
            status: 'Pending'
        });

        await newRequest.save();

        res.status(201).json({ 
            message: 'Mentorship request submitted successfully',
            request: newRequest 
        });
    } catch (error) {
        console.error('Error in requestMentorship:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Get mentorship requests for a specific mentor
const getRequests = async (req, res) => {
    try {
        const { mentorId } = req.params;
        
        const requests = await MentorshipRequest.find({ mentorId })
            .populate('menteeId', 'username fullName email profilePicture')
            .sort('-createdAt');
            
        res.json(requests);
    } catch (error) {
        console.error('Error in getRequests:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve or Reject mentorship request
const approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'Approved' or 'Rejected'

        const request = await MentorshipRequest.findById(requestId)
            .populate('menteeId', 'email fullName')
            .populate('mentorId', 'email fullName');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Update request status
        request.status = status;
        await request.save();

        // Send email notification to mentee
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { 
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const emailStatus = status === 'Approved' ? 'approved' : 'rejected';
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: request.menteeId.email,
            subject: `Mentorship Request ${emailStatus}`,
            html: `
                <h2>Mentorship Request ${status}</h2>
                <p>Your mentorship request to ${request.mentorId.fullName} has been ${emailStatus}.</p>
                ${status === 'Approved' ? '<p>You can now connect with your mentor to start your learning journey!</p>' : '<p>Feel free to connect with other mentors on our platform.</p>'}
                <a href="${process.env.FRONTEND_URL}/mentorship">Visit Mentorship Page</a>
            `
        };

        await transporter.sendMail(mailOptions);

        // Real-time notification via Socket.IO
        if (io && status === 'Approved') {
            io.emit(`mentorship-approved-${request.menteeId._id}`, {
                message: `Your mentorship request to ${request.mentorId.fullName} was approved!`,
                request: request
            });
        }

        res.json({ message: `Mentorship request ${status} successfully` });
    } catch (error) {
        console.error('Error in approveRequest:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Export all functions
module.exports = {
    listMentors,
    requestMentorship,
    getRequests,
    approveRequest,
    applyMentor,
    approveMentor,
    setSocketIO
};