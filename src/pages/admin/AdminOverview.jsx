import React from 'react';
import { useApp } from '../../hooks/useApp';

const AdminOverview = () => {
    const { allProfiles, products, isLoading } = useApp();

    if (isLoading) {
        return <p>Loading overview...</p>;
    }

    const userCount = allProfiles ? allProfiles.length : 0;
    const productCount = products ? products.length : 0;

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Overview</h1></div>
            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-value">{userCount}</div>
                    <div className="analytics-label">Total Users</div>
                </div>
                <div className="analytics-card">
                    <div className="analytics-value">{productCount}</div>
                    <div className="analytics-label">Total Listings</div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
