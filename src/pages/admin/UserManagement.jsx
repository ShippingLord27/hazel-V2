import React from 'react';
import { useApp } from '../../hooks/useApp';

const UserManagement = () => {
    const { allProfiles, isLoading } = useApp();

    if (isLoading || !allProfiles) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>User Management</h1></div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>User ID</th></tr></thead>
                    <tbody>
                        {allProfiles.map(user => (
                            <tr key={user.id}>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`status-${user.verification_status || 'unverified'}`}>
                                        {user.verification_status || 'unverified'}
                                    </span>
                                </td>
                                <td>{user.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
