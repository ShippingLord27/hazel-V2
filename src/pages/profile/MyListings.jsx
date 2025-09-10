import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import ListingModal from '../../components/ListingModal';

const ProfileProductCard = ({ product, onEdit, onDelete }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta profile-card-meta">
                    <button className="btn btn-outline btn-small" onClick={() => onEdit(product)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => onDelete(product.id)}><i className="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    );
};

const MyListings = () => {
    const { currentUser, products, deleteProduct } = useApp();
    const [isListingModalOpen, setListingModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    
    const handleEditListing = (product) => {
        setProductToEdit(product);
        setListingModalOpen(true);
    };

    const handleAddListing = () => {
        setProductToEdit(null);
        setListingModalOpen(true);
    };

    const handleDeleteListing = (productId) => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            deleteProduct(productId);
        }
    };

    const myListings = currentUser 
        ? products.filter(p => p.ownerId === currentUser.id) 
        : [];

    return (
        <>
            <div className="profile-view">
                <div className="profile-view-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1>My Listings</h1>
                    <button className="btn btn-primary" onClick={handleAddListing}>Add New Listing</button>
                </div>
                {myListings.length > 0 ? (
                    <div className="products-grid">
                        {myListings.map(p => <ProfileProductCard key={p.id} product={p} onEdit={handleEditListing} onDelete={handleDeleteListing} />)}
                    </div>
                ) : (
                    <p>You haven't listed any items yet. Click "Add New Listing" to get started!</p>
                )}
            </div>
            {isListingModalOpen && (
                <ListingModal 
                    productToEdit={productToEdit} 
                    closeModal={() => setListingModalOpen(false)}
                />
            )}
        </>
    );
};

export default MyListings;
