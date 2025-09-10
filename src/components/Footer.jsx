import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="common-footer">
            <div className="container">
                <div className="footer-container">
                    <div className="footer-col">
                        <h3>About HAZEL</h3>
                        <p>We are the leading rental platform connecting people who need items with those who have them to rent.</p>
                    </div>
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <ul className="footer-links">
                            <li><i className="fas fa-map-marker-alt"></i> 123 Rental St, City</li>
                            <li><i className="fas fa-phone"></i> (02) 8123-4567</li>
                            <li><i className="fas fa-envelope"></i> info@hazel.com</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 HAZEL. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
