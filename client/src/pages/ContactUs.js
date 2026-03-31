import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperPlane,
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faCheckCircle,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import 'aos/dist/aos.css';
import AOS from 'aos';
import './ContactUs.css';

const ContactUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            newErrors.name = 'Only letters and spaces allowed';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'Message should be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitSuccess(true);
            setFormData({ name: '', email: '', message: '' });
            setErrors({});

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-us">
            {/* Hero Section */}
            <div className="contact-hero" data-aos="fade">
                <div className="container">
                    <h1 className="hero-title" data-aos="fade-up">
                        Contact <span className="highlight">QA Hub</span>
                    </h1>
                    <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
                        We'd love to hear from you! Reach out with questions or feedback.
                    </p>
                </div>
            </div>

            <div className="container contact-container">
                <div className="row">
                    {/* Contact Form */}
                    <div className="col-lg-6" data-aos="fade-right">
                        <div className="contact-form-container">
                            <h3 className="form-title">
                                <FontAwesomeIcon icon={faPaperPlane} className="form-icon" />
                                Send us a message
                            </h3>

                            {submitSuccess && (
                                <div className="alert alert-success" role="alert">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">
                                        Your Message
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                    ></textarea>
                                    {errors.message && (
                                        <div className="invalid-feedback">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errors.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} /> Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-6" data-aos="fade-left">
                        <div className="contact-info-container">
                            <h3 className="info-title">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="info-icon" />
                                Our Information
                            </h3>

                            <div className="info-card">
                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    </div>
                                    <div className="info-content">
                                        <h5>Location</h5>
                                        <p>123 QA Street, Testing District<br />San Francisco, CA 94107</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>
                                    <div className="info-content">
                                        <h5>Phone</h5>
                                        <p>+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <div className="info-content">
                                        <h5>Email</h5>
                                        <p>info@qahub.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.158583101358!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="QA Hub Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;