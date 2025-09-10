import React, { useState } from 'react';

const faqData = [
    {
        question: 'How does HAZEL work?',
        answer: 'HAZEL is a peer-to-peer rental platform. Owners list their items for rent, and renters can browse and book these items for a specific duration. We handle secure payments and provide a framework for communication and trust between users.'
    },
    {
        question: 'Is it safe to rent items from others?',
        answer: 'Yes. We prioritize safety and trust. We encourage all users to complete our Identity Verification process. Additionally, our review system allows you to see feedback from other users, and our secure messaging system lets you communicate with the owner before you rent.'
    },
    {
        question: 'What happens if an item I rent gets damaged?',
        answer: 'Renters are responsible for the items during the rental period. We recommend you communicate with the owner immediately if any damage occurs. Many owners specify their own terms regarding damages and late fees in the listing description. Disputes can be mediated through our support team.'
    },
];

const FaqItem = ({ item, isOpen, onClick }) => {
    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <div className="faq-question" onClick={onClick}>
                <span>{item.question}</span>
                <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer" style={{ maxHeight: isOpen ? '200px' : '0' }}>
                <p>{item.answer}</p>
            </div>
        </div>
    );
};

const FaqPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="page active" id="faq-page" style={{ paddingTop: '70px' }}>
            <div className="container faq-page-container">
                <section className="faq-hero">
                    <div className="faq-hero-content">
                        <h1>Frequently Asked Questions</h1>
                        <p>Find answers to common questions about using HAZEL.</p>
                    </div>
                </section>
                <section className="faq-list">
                    <div className="faq-accordion">
                        {faqData.map((item, index) => (
                            <FaqItem 
                                key={index} 
                                item={item} 
                                isOpen={openIndex === index}
                                onClick={() => handleClick(index)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FaqPage;
