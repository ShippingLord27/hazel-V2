import React from 'react';
import { useApp } from '../../hooks/useApp';

const OwnerDashboard = ({ user, products, ownerLentHistory }) => {
    const myListingsCount = products.filter(p => p.ownerId === user.id).length;
    const activeLentCount = ownerLentHistory.filter(r => r.status === 'Active').length;
    const totalEarnings = ownerLentHistory
        .filter(r => r.status === 'Completed')
        .reduce((sum, r) => sum + r.rentalTotalCost, 0);

    return (
        <>
            <div className="profile-view-header">
                <h1>Welcome, {user.name}!</h1>
                <p>Here's an overview of your rental activity.</p>
            </div>
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-value">{myListingsCount}</div>
                <div className="analytics-label">Total Listings</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">{activeLentCount}</div>
                <div className="analytics-label">Items Rented Out</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">₱{totalEarnings.toFixed(2)}</div>
                <div className="analytics-label">Total Earnings</div>
            </div>
            </div>
        </>
    );
};

const RenterDashboard = ({ user, rentalHistory }) => (
     <>
        <div className="profile-view-header">
            <h1>Welcome, {user.name}!</h1>
            <p>Here's a summary of your account.</p>
        </div>
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-value">{rentalHistory ? rentalHistory.filter(r => r.status === 'Active').length : 0}</div>
                <div className="analytics-label">Active Rentals</div>
            </div>
        </div>
    </>
);

const ProfileDashboard = () => {
    const { currentUser, products, rentalHistory, ownerLentHistory } = useApp();
    if (!currentUser) return null;

    return (
        <div className="profile-view">
           {currentUser.role === 'owner' 
                ? <OwnerDashboard user={currentUser} products={products} ownerLentHistory={ownerLentHistory} /> 
                : <RenterDashboard user={currentUser} rentalHistory={rentalHistory} />
           }
        </div>
    );
};

export default ProfileDashboard;
