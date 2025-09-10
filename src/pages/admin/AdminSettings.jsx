import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import supabase from '../../supabaseClient';

const AdminSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();
    const [settingsData, setSettingsData] = useState({
        first_name: '', last_name: '', profile_pic_url: ''
    });
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmNewPassword: '' });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                profile_pic_url: currentUser.profile_pic_url || ''
            });
        }
    }, [currentUser]);

     const handleChange = (e) => {
        setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await updateUser(currentUser.id, settingsData);

        if (passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                showToast("New passwords do not match.");
                return;
            }
            const { error: passwordError } = await supabase.auth.updateUser({ password: passwordData.newPassword });
            if (passwordError) {
                showToast(`Password update failed: ${passwordError.message}`);
            } else {
                showToast("Password updated successfully!");
                setPasswordData({ newPassword: '', confirmNewPassword: '' });
            }
        }
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Account Settings</h1></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>First Name*</label><input type="text" name="first_name" value={settingsData.first_name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Last Name*</label><input type="text" name="last_name" value={settingsData.last_name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={currentUser?.email || ''} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profile_pic_url" value={settingsData.profile_pic_url} onChange={handleChange} /></div>
                <hr/>
                <h3>Change Password</h3>
                <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} /></div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminSettings;
