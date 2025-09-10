import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';

const ContentManagement = () => {
    const { rentalAgreementTemplate, setRentalAgreementTemplate, showToast } = useApp();
    const [agreementText, setAgreementText] = useState(rentalAgreementTemplate);

    const handleSave = () => {
        setRentalAgreementTemplate(agreementText);
        showToast("Templates saved successfully!");
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header">
                <h1>Content & Template Management</h1>
                <p>Edit site-wide templates and important text content.</p>
            </div>
            <div className="form-group">
                <label>Standard Rental Agreement Snippet:</label>
                <textarea 
                    rows="10"
                    value={agreementText}
                    onChange={(e) => setAgreementText(e.target.value)}
                ></textarea>
            </div>
            <button className="btn btn-primary" onClick={handleSave}>Save Templates</button>
        </div>
    );
};

export default ContentManagement;
