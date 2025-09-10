import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import supabase from '../../supabaseClient';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();

    const [settingsData, setSettingsData] = useState({ name: '', profilePic: '', location: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmNewPassword: '' });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                name: currentUser.name || '',
                profilePic: currentUser.profile_pic || '',
                location: currentUser.location || '',
                phone: currentUser.phone || '',
            });
        }
    }, [currentUser]);

    const handleSettingsChange = (e) => setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const [firstName, ...lastNameParts] = settingsData.name.split(' ');
        const lastName = lastNameParts.join(' ');

        const updates = {
            first_name: firstName,
            last_name: lastName,
            location: settingsData.location,
            phone: settingsData.phone,
        };
        
        await updateUser(currentUser.id, updates);
        
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
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSaveChanges}>
                <h3>Personal Information</h3>
                <div className="form-group"><label>Full Name*</label><input type="text" name="name" value={settingsData.name} onChange={handleSettingsChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" value={currentUser?.email || ''} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profilePic" value={settingsData.profilePic} onChange={handleSettingsChange} /></div>
                <div className="form-group"><label>Location</label><input type="text" name="location" value={settingsData.location} onChange={handleSettingsChange} /></div>
                <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={settingsData.phone} onChange={handleSettingsChange} /></div>
                <hr/>
                <h3>Change Password</h3>
                <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} /></div>
                <button type="submit" className="btn btn-primary">Save All Changes</button>
            </form>
        </div>
    );
};

export default ProfileSettings;
