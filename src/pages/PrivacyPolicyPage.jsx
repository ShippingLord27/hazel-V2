import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="page active" id="privacy-policy-page" style={{ paddingTop: '70px' }}>
            <div className="container privacy-policy-page-container">
                <section className="privacy-policy-hero">
                    <div className="privacy-policy-hero-content">
                        <h1>Privacy Policy</h1>
                        <p>Last updated: October 26, 2025</p>
                    </div>
                </section>
                <section className="privacy-policy-content">
                    <p>HAZEL ("us", "we", or "our") operates the HAZEL website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
                    
                    <h2>Information Collection and Use</h2>
                    <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                    <h3>Types of Data Collected</h3>
                    <ul>
                        <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, Phone number, Address, and payment information.</li>
                        <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This may include your computer's IP address, browser type, pages visited, and other diagnostic data.</li>
                    </ul>

                    <h2>Data Security</h2>
                    <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
