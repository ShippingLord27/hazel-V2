import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';

const ListingModal = ({ productToEdit, closeModal }) => {
    const { addProduct, updateProduct, showToast } = useApp();
    const isEditMode = Boolean(productToEdit);

    const initialFormState = {
        title: '', fullTitle: '', category: '', price: '',
        image: '', description: '', trackingTagId: '', ownerTerms: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                title: productToEdit.title || '',
                fullTitle: productToEdit.fullTitle || '',
                category: productToEdit.category.toLowerCase() || '',
                price: productToEdit.price ? String(productToEdit.price) : '',
                image: productToEdit.image || '',
                description: productToEdit.description || '',
                trackingTagId: productToEdit.trackingTagId || '',
                ownerTerms: productToEdit.ownerTerms || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [productToEdit, isEditMode]);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.category || !formData.price || !formData.image || !formData.description) {
            showToast("Please fill out all required fields marked with *.");
            return;
        }
        
        const priceNumber = parseFloat(formData.price);
        if (isNaN(priceNumber) || priceNumber <= 0) {
            showToast("Please enter a valid positive number for the price.");
            return;
        }

        const productData = {
            title: formData.title,
            fullTitle: formData.fullTitle,
            category: formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
            price: priceNumber,
            image: formData.image,
            description: formData.description,
            trackingTagId: formData.trackingTagId,
            ownerTerms: formData.ownerTerms,
        };

        if (isEditMode) {
            updateProduct({ ...productToEdit, ...productData });
        } else {
            addProduct(productData);
        }
        closeModal();
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <button className="modal-close-btn" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group"><label>Title*</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Full Title</label><input type="text" name="fullTitle" value={formData.fullTitle} onChange={handleChange} /></div>
                        <div className="form-group"><label>Category*</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="" disabled>Select a Category</option>
                                <option value="tools">Tools</option><option value="electronics">Electronics</option><option value="vehicles">Vehicles</option><option value="party">Party</option><option value="sports">Sports</option><option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price per day (₱)*</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="25.00"
                                step="0.01"
                                min="0.01"
                            />
                        </div>
                        <div className="form-group"><label>Image URL*</label><input type="url" name="image" value={formData.image} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Tracking Tag ID (for your reference)</label><input type="text" name="trackingTagId" value={formData.trackingTagId} onChange={handleChange} /></div>
                        <div className="form-group"><label>Description*</label><textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea></div>
                        <div className="form-group"><label>Custom Rental Terms (Optional)</label><textarea name="ownerTerms" rows="3" value={formData.ownerTerms} onChange={handleChange}></textarea></div>
                        <button type="submit" className="btn btn-primary btn-block">{isEditMode ? 'Save Changes' : 'Submit for Approval'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ListingModal;
