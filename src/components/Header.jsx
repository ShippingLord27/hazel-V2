import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import AuthModal from './AuthModal';
import Search from './Search';

const Header = () => {
    const { theme, toggleTheme, currentUser, logout, cart } = useApp();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [initialAuthTab, setInitialAuthTab] = useState('login');
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };
    
    const openAuthModal = (tab) => {
        setInitialAuthTab(tab);
        setAuthModalOpen(true);
    };
    
    const cartItemCount = cart ? cart.length : 0;

    const renderUserNav = () => {
        if (!currentUser) {
            return (
                <div id="loggedOutNavButtons">
                    <button className="btn btn-outline" onClick={() => openAuthModal('login')}>Login</button>
                    <button className="btn btn-primary" onClick={() => openAuthModal('signup')}>Sign Up</button>
                </div>
            );
        }

        return (
            <div id="loggedInNavButtons" className="auth-nav-state">
                {currentUser.role === 'renter' && (
                    <Link to="/cart" className="header-cart-link">
                        <i className="fas fa-shopping-cart"></i>
                        {cartItemCount > 0 && <span id="cartItemCount" style={{ display: 'flex' }}>{cartItemCount}</span>}
                    </Link>
                )}
                
                {currentUser.role === 'admin' && (
                    <Link to="/admin" className="header-admin-link">
                        <i className="fas fa-user-shield"></i> Admin
                    </Link>
                )}

                {currentUser.role !== 'admin' && (
                    <Link to="/profile" className="header-profile-link">
                        <i className="fas fa-user-circle"></i> Profile
                    </Link>
                )}

                <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </div>
        );
    };

    return (
        <>
            <header>
                <div className="container header-container">
                    <Link to="/" className="logo">HAZEL</Link>
                    <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                        <Search />
                        <ul>
                           <li><NavLink to="/" end>Home</NavLink></li>
                           <li><NavLink to="/products">Products</NavLink></li>
                           <li><NavLink to="/about">About</NavLink></li>
                           <li><NavLink to="/contact">Contact</NavLink></li>
                        </ul>
                        <div className="nav-buttons">
                            <button className="dark-mode-toggle" onClick={toggleTheme}>
                                {theme === 'dark' ? <><i className="fas fa-sun"></i> Light</> : <><i className="far fa-moon"></i> Dark</>}
                            </button>
                            {renderUserNav()}
                        </div>
                    </nav>
                    <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>
                </div>
            </header>
            {isAuthModalOpen && <AuthModal closeModal={() => setAuthModalOpen(false)} initialTab={initialAuthTab} />}
        </>
    );
};

export default Header;
