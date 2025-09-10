import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const AdminDashboardPage = () => {
    const { currentUser, isLoading, logout } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!currentUser || currentUser.role !== 'admin')) {
            navigate('/');
        }
    }, [currentUser, isLoading, navigate]);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        // The useEffect hook above handles navigation when currentUser becomes null.
    };

    if (isLoading || !currentUser) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Authorizing...</div>;
    }
    
    return (
        <div className="page active" id="adminDashboardPage" style={{ paddingTop: '70px' }}>
            <div className="container admin-dashboard-container">
                <aside className="admin-sidebar">
                    <img src={currentUser.profile_pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'} alt="Admin Profile" id="adminSidebarPic" />
                    <h3>{currentUser.name}</h3>
                    <p>{currentUser.email}</p>
                    <ul className="sidebar-menu">
                        <li><NavLink to="/admin" end><i className="fas fa-chart-line"></i> Overview</NavLink></li>
                        <li><NavLink to="/admin/users"><i className="fas fa-users-cog"></i> User Management</NavLink></li>
                        <li><NavLink to="/admin/listings"><i className="fas fa-tasks"></i> Listing Management</NavLink></li>
                        <li><NavLink to="/admin/content"><i className="fas fa-file-alt"></i> Content Management</NavLink></li>
                        <li><NavLink to="/admin/settings"><i className="fas fa-user-cog"></i> Admin Settings</NavLink></li>
                        <li><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                </aside>
                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
