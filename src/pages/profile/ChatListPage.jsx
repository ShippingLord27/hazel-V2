import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';

const ChatListPage = () => {
    const { chatThreads } = useApp();
    const navigate = useNavigate();

    const handleThreadClick = (threadId) => {
        navigate(`/chat?thread_id=${threadId}`);
    };

    return (
        <div className="profile-view">
            <div className="profile-view-header">
                <h1>My Conversations</h1>
                <p>Select a conversation to view your chat history.</p>
            </div>
            <div className="chat-thread-list">
                {!chatThreads ? (
                    <p>Loading conversations...</p>
                ) : chatThreads.length > 0 ? (
                    chatThreads.map(thread => {
                        if (!thread.partner) return null; 

                        return (
                            <div key={thread.thread_id} className="chat-thread-item" onClick={() => handleThreadClick(thread.thread_id)}>
                                <img src={thread.partner.profile_pic} alt={thread.partner.name} className="chat-thread-avatar" />
                                <div className="chat-thread-info">
                                    <h4>{thread.partner.name}</h4>
                                    <p>{thread.last_message_content ? `${thread.last_message_content.substring(0, 40)}...` : 'No messages yet'}</p>
                                </div>
                                {thread.unread_count > 0 && (
                                    <span className="unread-count-badge">{thread.unread_count}</span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>You have no active conversations. Start a chat with an item owner to see it here.</p>
                )}
            </div>
        </div>
    );
};

export default ChatListPage;
