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
        const newApplication = new MentorApplication({ ...req.body, userId: req.user.id });
        await newApplication.save();
        res.status(201).json({ message: 'Mentor application submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve or Reject Mentor Application
const approveMentor = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await MentorApplication.findByIdAndUpdate(applicationId, { status }, { new: true });
        if (!application) return res.status(404).json({ error: 'Application not found' });

        if (status === 'Approved') {
            const user = await User.findById(application.userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // ✅ Update user role
            user.role = 'Mentor';
            user.mentorStatus = 'Approved';
            await user.save();

            // ✅ Create new mentor entry
            const newMentor = new Mentor({
                userId: user._id,
                name: user.name,
                email: user.email,
                expertise: application.expertise,
                experience: application.experience,
                availability: application.availability
            });
            await newMentor.save();
        }

        res.json({ message: `Mentor application ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ List all approved mentors
const listMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Request mentorship from a mentor
const requestMentorship = async (req, res) => {
    try {
        const newRequest = new MentorshipRequest({ ...req.body, menteeId: req.user.id, status: 'Pending' });
        await newRequest.save();
        res.status(201).json({ message: 'Mentorship request submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Get mentorship requests for a mentor
const getRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({ mentorId: req.params.mentorId })
            .populate('menteeId', 'name email');
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve mentorship request
const approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await MentorshipRequest.findByIdAndUpdate(requestId, { status: 'Approved' }, { new: true });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        const mentee = await User.findById(request.menteeId);
        const mentor = await User.findById(request.mentorId);
        if (!mentee || !mentor) return res.status(404).json({ error: 'User not found' });

        // ✅ Send Email Notification
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: mentee.email,
            subject: 'Mentorship Request Approved',
            text: `Your mentorship request with ${mentor.name} has been approved!`
        };

        await transporter.sendMail(mailOptions);

        // ✅ Real-time Notification
        io.emit(`mentorship-approved-${mentee._id}`, { message: 'Your mentorship request was approved!' });

        res.json({ message: 'Mentorship request approved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { listMentors, requestMentorship, getRequests, approveRequest, applyMentor, approveMentor,setSocketIO };
