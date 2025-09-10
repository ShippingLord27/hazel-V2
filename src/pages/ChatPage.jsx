import React, { useEffect, useRef } from 'react';
import { useApp } from '../hooks/useApp';

const ChatPage = () => {
    const { currentUser, chatThreads, openChat, closeChat, chatPartner, chatMessages, sendMessage } = useApp();
    const [message, setMessage] = React.useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);
    useEffect(() => {
        if (!chatPartner && chatThreads.length > 0) {
            openChat(chatThreads[0].partner);
        }
    }, [chatThreads, chatPartner]);

    const handleSendMessage = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage('');
    };

    if (!currentUser) {
        return <div className="page active" style={{ paddingTop: '100px', textAlign: 'center' }}>Please log in to view your messages.</div>;
    }

    return (
        <div className="page active" id="chat-page" style={{ paddingTop: '70px' }}>
            <div className="chat-inbox-container">
                <aside className="conversation-list">
                    <div className="inbox-header">
                        <h2>Inbox</h2>
                    </div>
                    {chatThreads.map(thread => (
                        <div 
                            key={thread.thread_id} 
                            className={`conversation-item ${chatPartner?.email === thread.partner.email ? 'active' : ''}`}
                            onClick={() => openChat(thread.partner)}
                        >
                            <img src={thread.partner.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'} alt={thread.partner.name} className="conversation-avatar" />
                            <div className="conversation-details">
                                <h4>{thread.partner.name}</h4>
                                <p>{thread.messages.length > 0 ? thread.messages[thread.messages.length - 1].content : 'No messages yet'}</p>
                            </div>
                            {thread.unreadCount > 0 && <span className="unread-badge">{thread.unreadCount}</span>}
                        </div>
                    ))}
                </aside>
                <main className="active-chat-window">
                    {chatPartner ? (
                        <>
                            <div className="chat-header">
                                <h3>{chatPartner.name}</h3>
                            </div>
                            <div className="chat-messages-container">
                                {chatMessages.map(msg => {
                                    const isSent = msg.sender_email === currentUser.email;
                                    const messageTime = new Date(msg.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                                    return (
                                        <div key={msg.id} className={`chat-message ${isSent ? 'sent' : 'received'}`}>
                                            <div className="message-content">
                                                 <span className="message-sender">{isSent ? 'You' : chatPartner.name}</span>
                                                 {msg.content}
                                                 <span className="message-timestamp">{messageTime}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="chat-input-area">
                                <input 
                                    type="text" 
                                    className="chat-message-input" 
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="chat-send-message-btn" onClick={handleSendMessage}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ChatPage;
