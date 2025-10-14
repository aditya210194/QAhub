const Joi = require('joi');

const registerValidator = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    fullName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

module.exports = registerValidator;
