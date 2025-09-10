import React from 'react';
import { useApp } from '../../hooks/useApp';
import ProductCard from '../../components/ProductCard';

const Favorites = () => {
    const { currentUser, products, isLoading } = useApp();

    if (isLoading) {
        return (
            <div className="profile-view">
                <div className="profile-view-header"><h1>My Favorites</h1></div>
                <p>Loading favorites...</p>
            </div>
        );
    }
    
    const favoriteProducts = currentUser?.favorite_item_ids
        ? currentUser.favorite_item_ids
            .map(id => products.find(p => p.id === id))
            .filter(Boolean) 
        : [];

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>My Favorites</h1></div>
            {favoriteProducts.length > 0 ? (
                <div className="products-grid">
                    {favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            ) : (
                <p>You haven't favorited any items yet. Click the heart icon on any product to save it here.</p>
            )}
        </div>
    );
};

export default Favorites;
