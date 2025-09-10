import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Toast from './Toast';
import ChatWidget from './ChatWidget';
import { useApp } from '../hooks/useApp';

const Layout = () => {
  const { toggleChat } = useApp();

  return (
    <>
      <Header />
      <main>
        <Outlet /> 
      </main>
      <Footer />
      <Toast />
       <div className="chat-widget-container">
          <ChatWidget />
          <button className="chat-toggle-btn" onClick={toggleChat} aria-label="Toggle chat">
            <i className="fas fa-comments"></i>
          </button>
      </div>
    </>
  );
};

export default Layout;
