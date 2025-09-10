import React, { useEffect } from 'react';

const teamMembers = [
    {
        name: 'Jace R. Torres',
        role: 'Main Developer / Documentation',
        imgSrc: 'https://i.ibb.co/HT0Nz7j1/download-12.jpg'
    },
    {
        name: 'Gurkarn Q. Singh',
        role: 'Backup Developer / Documentation',
        imgSrc: 'https://i.ibb.co/MDQJNcRS/download-14.jpg'
    },
    {
        name: 'Olive Leigh A. Mendoza',
        role: 'Front End Developer / Design / Documentation',
        imgSrc: 'https://i.ibb.co/Rkm65MZZ/download-13.jpg'
    },
    {
        name: 'Romeo Victor D. Nogaliza',
        role: 'Spokeperson / Documentation',
        imgSrc: 'https://i.ibb.co/fGCqLmjw/494888334-1322942232103903-4287235928389679842-n.jpg'
    },
];

const valuesData = [
    {
        iconClass: 'fas fa-handshake',
        title: 'Trust',
        description: 'We build trust through verification systems, secure payments, and community reviews.'
    },
    {
        iconClass: 'fas fa-leaf',
        title: 'Sustainability',
        description: 'We promote the sharing economy to reduce waste and overconsumption.'
    },
    {
        iconClass: 'fas fa-users',
        title: 'Community',
        description: 'We believe in bringing people together and strengthening local connections.'
    },
    {
        iconClass: 'fas fa-gem',
        title: 'Quality',
        description: 'We maintain high standards for the items listed on our platform.'
    },
];

const AboutPage = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page active" id="about-page" style={{ paddingTop: '70px' }}>
            <div className="container about-page-container">
                
                <section className="about-hero">
                    <div className="about-hero-content">
                        <h1>About HAZEL</h1>
                        <p>Connecting people with the things they need through a trusted rental community</p>
                    </div>
                </section>

                <section className="our-story">
                    <div className="section-title">
                        <h2>Our Story</h2>
                    </div>
                    <div className="about-container">
                        <div className="about-content">
                            <p>HAZEL was founded in 2025 with a simple mission: to make renting items as easy as possible. The 4 founders, recognized that many people own items they rarely use, while others need those same items for short periods.</p>
                            <p>What started as a small local platform has grown into a nationwide rental community with thousands of users. We've helped people save money, reduce waste, and build connections in their communities.</p>
                            <p>Today, we're proud to be the leading peer-to-peer rental platform, offering everything from power tools to party equipment and more.</p>
                        </div>
                        <div className="about-img">
                            <img src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="HAZEL team working" />
                        </div>
                    </div>
                </section>

                <section className="mission-vision">
                    <div className="mission">
                        <h2>Our Mission</h2>
                        <p>To create a sustainable sharing economy by making rental access to goods more convenient and affordable than ownership, while building trust between community members.</p>
                    </div>
                    <div className="vision">
                        <h2>Our Vision</h2>
                        <p>We envision a world where people have access to what they need without the burden of ownership, reducing waste and consumption while strengthening local communities.</p>
                    </div>
                </section>

                <section className="team-section">
                    <div className="section-title">
                        <h2>Meet Our Team</h2>
                        <p>The passionate people behind HAZEL</p>
                    </div>
                    <div className="team-grid">
                        {teamMembers.map((member) => (
                            <div className="team-member" key={member.name}>
                                <img src={member.imgSrc} alt={member.name} className="team-member-img" />
                                <div className="team-member-info">
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="values-section">
                    <div className="section-title">
                        <h2>Our Values</h2>
                        <p>The principles that guide everything we do</p>
                    </div>
                    <div className="values-grid">
                        {valuesData.map((value) => (
                             <div className="value-card" key={value.title}>
                                <div className="value-icon">
                                    <i className={value.iconClass}></i>
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
