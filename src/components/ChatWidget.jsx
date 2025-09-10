import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../hooks/useApp';
import { runChat as runAiChat } from '../gemini';

const ChatWidget = () => {
    const { isChatOpen, closeChat, chatPartner, currentUser } = useApp();
    const [localMessages, setLocalMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const isAiSupportChat = chatPartner?.id === 'support'; 
    const messagesToDisplay = isAiSupportChat ? localMessages : []; 

    useEffect(() => {
        if (isChatOpen && isAiSupportChat) {
            const userName = currentUser?.name ? ` ${currentUser.name}` : '';
            setLocalMessages([{
                content: `Hello${userName}! You are chatting with HAZEL's AI Assistant. How can I help you?`,
                isUser: false,
                timestamp: new Date().toISOString()
            }]);
        }
    }, [isChatOpen, isAiSupportChat, chatPartner, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesToDisplay]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() || isLoading) return;
        
        const userMessage = { content: messageText, isUser: true, timestamp: new Date().toISOString() };
        setLocalMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setMessage('');

        if (isAiSupportChat) {
            const aiResponse = await runAiChat(messageText);
            const aiMessage = { content: aiResponse, isUser: false, timestamp: new Date().toISOString() };
            setLocalMessages(prev => [...prev, aiMessage]);
        }
        
        setIsLoading(false);
    };

    if (!isChatOpen) return null;

    return (
        <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
            <div className="chat-header">
                <span className="chat-header-contact-name">Chat with {chatPartner?.name || 'Support'}</span>
                <button className="chat-close-btn" onClick={closeChat}>×</button>
            </div>
            <div className="chat-messages-container">
                {messagesToDisplay.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.isUser ? 'sent' : 'received'}`}>
                        {msg.content}
                    </div>
                ))}
                {isLoading && <div className="chat-message received">...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <input 
                    type="text" 
                    className="chat-message-input" 
                    placeholder={currentUser ? "Type your message..." : "Please log in to chat"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message)}
                    disabled={!currentUser || isLoading}
                />
                <button className="chat-send-message-btn" onClick={() => handleSendMessage(message)} disabled={!currentUser || isLoading}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;
