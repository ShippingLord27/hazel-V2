import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProfilePage = () => {
    const { currentUser, isLoading, logout } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!currentUser) {
                navigate('/');
            } else if (currentUser.role === 'admin') {
                navigate('/admin');
            }
        }
    }, [currentUser, isLoading, navigate]);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        // The useEffect hook above handles navigation when currentUser becomes null.
    };

    if (isLoading || !currentUser) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Profile...</div>;
    }

    const ownerMenu = [
        { path: "/profile", end: true, icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "my-listings", icon: "fas fa-list", label: "My Listings" },
        { path: "messages", icon: "fas fa-comments", label: "Messages" },
        { path: "rental-tracker", icon: "fas fa-route", label: "Rental Tracker" },
        { path: "settings", icon: "fas fa-cog", label: "Settings" }
    ];

    const renterMenu = [
        { path: "/profile", end: true, icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "favorites", icon: "fas fa-heart", label: "Favorites" },
        { path: "messages", icon: "fas fa-comments", label: "Messages" },
        { path: "rental-tracker", icon: "fas fa-route", label: "Rental Tracker" },
        { path: "settings", icon: "fas fa-cog", label: "Settings" }
    ];
    
    const menuToRender = currentUser.role === 'owner' ? ownerMenu : renterMenu;

    return (
        <div className="page active" id="profilePage" style={{ paddingTop: '70px' }}>
            <div className="container profile-page-main-container"> 
                <div className="profile-container">
                    <aside className="profile-sidebar">
                        <img src={currentUser.profile_pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'} alt="Profile" id="profilePicSidebar" />
                        <h3>{currentUser.name}</h3>
                        <p>{currentUser.email}</p>
                        <ul className="sidebar-menu">
                            {menuToRender.map(item => (
                                <li key={item.path}>
                                    <NavLink to={item.path} end={item.end}>
                                        <i className={item.icon}></i> {item.label}
                                    </NavLink>
                                </li>
                            ))}
                            <li><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
                        </ul>
                    </aside>
                    <main className="profile-main-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
