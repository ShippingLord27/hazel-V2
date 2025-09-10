import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';

const ContactPage = () => {
    const { showToast } = useApp();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showToast("Please fill out all required fields.", "error");
            return;
        }
        console.log("Form submitted:", formData); 
        showToast("Thank you! Your message has been sent.");
        setFormData({ name: '', email: '', subject: '', message: '' }); 
    };

    return (
        <div className="page active" id="contact-page" style={{ paddingTop: '70px' }}>
            <div className="container contact-page-container">
                <section className="contact-hero">
                    <div className="contact-hero-content">
                        <h1>Get in Touch</h1>
                        <p>We'd love to hear from you! Whether you have a question, feedback, or just want to say hello.</p>
                    </div>
                </section>
                <section className="contact-content-section">
                    <div className="contact-form-container">
                        <h2>Send Us a Message</h2>
                        <form id="contactForm" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="contactName">Full Name*</label>
                                <input type="text" id="contactName" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactEmail">Email Address*</label>
                                <input type="email" id="contactEmail" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactSubject">Subject*</label>
                                <input type="text" id="contactSubject" name="subject" value={formData.subject} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactMessage">Message*</label>
                                <textarea id="contactMessage" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
                        </form>
                    </div>
                    <div className="contact-details-container">
                        <h2>Contact Information</h2>
                        <p>Feel free to reach out to us through any of the following channels:</p>
                        <ul className="contact-info-list">
                            <li><i className="fas fa-map-marker-alt"></i><span>123 Rental St, City, Country 12345</span></li>
                            <li><i className="fas fa-phone"></i><span>(02) 8123-4567</span></li>
                            <li><i className="fas fa-envelope"></i><span>info@hazel.com</span></li>
                            <li><i className="fas fa-clock"></i><span>Mon - Fri: 9:00 AM - 6:00 PM</span></li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;
