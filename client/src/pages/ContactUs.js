import React, { useState } from 'react';
import './ContactUs.css';
import SecondHeader from "./SecondHeader";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/submitContactForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                alert('Form submitted successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Failed to submit the form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="contact-us">
            <SecondHeader />
            <div className="container">
                <h1>Contact Us</h1>
                <div className="row">
                    <div className="col-md-6">
                        <h4>Get in Touch</h4>
                        <p>If you have any questions, feel free to reach out to us by filling out the form below:</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <div className="col-md-6">
                        <h4>Our Address</h4>
                        <p>6/149 3rd Floor Nirankari Colony, GTB Nagar, Delhi, 110009, India</p>
                        <p>Email: kumar.aditya670@gmail.com</p>
                        <p>Phone: +91-9501978412</p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=..."
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
