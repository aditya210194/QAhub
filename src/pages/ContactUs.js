import React from 'react';
import './ContactUs.css';
import SecondHeader from "./SecondHeader";

const ContactUs = () => {
    return (
        <div className="contact-us">
            {/* Include the second header here */}
            <SecondHeader/>
            <div className="container">
                <h2 className="text-center mb-4">Contact Us</h2>
                <div className="row">
                    <div className="col-md-6">
                        <h4 className="text-center">Get in Touch</h4>
                        <p>If you have any questions or need assistance, feel free to reach out to us through the
                            contact form or the details below.</p>
                        <p>
                            <strong>Email:</strong> support@eduadda.com
                        </p>
                        <p>
                            <strong>Phone:</strong> +91-123-456-7890
                        </p>
                        <p>
                            <strong>Address:</strong> 123 EduAdda Street, Knowledge City, India
                        </p>
                    </div>
                    <div className="col-md-6">
                        <h4 className="text-center">Your Query</h4>
                        <p>If you have specific queries or topics you want us to cover, please let us know below:</p>
                        <form>
                            <div className="form-group">
                                <label htmlFor="query">Your Query</label>
                                <textarea className="form-control" id="query" rows="4"
                                          placeholder="What would you like to know?" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Send Query</button>
                        </form>
                    </div>


                    {/* Google Map Section */}
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <h4 className="text-center">Find Us Here</h4>
                            <div className="map-responsive">
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.947701161977!2d144.96305831567976!3d-37.8163279797515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0fe5cd73%3A0xa3136e6aef58da34!2sEduAdda!5e0!3m2!1sen!2sin!4v1636606321461!5m2!1sen!2sin"
                                    width="100%"
                                    height="400"
                                    style={{border: 0}}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h4 className="text-center">Contact Form</h4>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Your Name"
                                           required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Your Email"
                                           required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea className="form-control" id="message" rows="4" placeholder="Your Message"
                                              required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;
