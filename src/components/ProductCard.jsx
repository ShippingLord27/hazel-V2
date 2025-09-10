import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProductCard = ({ product }) => {
    const { currentUser, toggleFavorite } = useApp();
    const navigate = useNavigate();

    const isFavorite = currentUser?.favorite_item_ids?.includes(product.id);

    return (
        <div className="product-card" data-product-id={product.id}>
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta">
                    <div className="product-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                    </div>
                    <div className="product-actions">
                         <button 
                            className="btn btn-primary view-listing btn-small" 
                            onClick={() => navigate(`/listing/${product.id}`)}
                         >
                            Details
                         </button>
                         {currentUser && currentUser.role === 'renter' && (
                            <button 
                                className={`btn btn-icon favorite-toggle-btn ${isFavorite ? 'active' : ''}`} 
                                aria-label="Toggle Favorite"
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
