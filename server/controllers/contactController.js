const Joi = require('joi');
const Contact = require('../models/Contact');
const AppError = require('../utils/AppError');

const contactSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    message: Joi.string().trim().min(10).max(500).required(),
});

const submitContactForm = async (req, res, next) => {
    try {
        console.log("Received Data:", req.body); // Debug log

        const { error } = contactSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }

        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        console.log("Saved to DB:", newContact); // Debug log
        res.status(201).json({ message: 'Message submitted successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        next(err);
    }
};

module.exports = { submitContactForm };
