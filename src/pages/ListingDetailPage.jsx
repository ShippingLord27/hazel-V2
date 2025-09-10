import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ReviewModal from '../components/ReviewModal';

const ListingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, currentUser, showToast, openChat } = useApp();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [rentalOptions, setRentalOptions] = useState({ days: '1', deliveryFee: '0', startDate: '' });
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
            setSelectedImage(foundProduct.image);
        } else if (products.length > 0) { // Avoid redirecting while products are still loading
            showToast("Sorry, that listing could not be found.");
            navigate('/products');
        }
    }, [id, products, navigate, showToast]);

    const rentalPriceDetails = useMemo(() => {
        if (!product) return { total: 0, perDay: 0 };
        const basePrice = product.price;
        const days = parseInt(rentalOptions.days);
        let total = basePrice * days;
        if (days === 3) total = basePrice * 2.5;
        if (days === 7) total = basePrice * 5;
        const perDay = total / days;
        return { total, perDay };
    }, [product, rentalOptions.days]);

    const handleOptionChange = (e) => setRentalOptions(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleAddToCart = () => {
        if (!currentUser) { showToast("Please login to rent an item."); return; }
        if (currentUser.id === product.ownerId) { showToast("You cannot rent your own item."); return; }
        if (!rentalOptions.startDate) { showToast("Please select a rental start date."); return; }
        const cartItem = {
            productId: product.id, rentalDurationDays: parseInt(rentalOptions.days),
            rentalTotalCost: rentalPriceDetails.total, deliveryOption: rentalOptions.deliveryFee === '0' ? 'pickup' : 'delivery',
            deliveryFee: parseInt(rentalOptions.deliveryFee), rentalStartDate: rentalOptions.startDate,
        };
        const success = addToCart(cartItem);
        if (success) { navigate('/cart'); }
    };
    
    const handleChatWithOwner = async () => {
        if (!currentUser) { showToast("Please login to chat with the owner."); return; }
        const partner = { id: product.ownerId, name: product.ownerName, profile_pic: null }; // Profile pic can be fetched in openChat
        const threadId = await openChat(partner, product.id);
        if (threadId) {
            navigate(`/chat?thread_id=${threadId}`);
        }
    };

    const getTodayString = () => new Date().toISOString().split('T')[0];
    if (!product) { return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading listing...</div>; }

    return (
        <>
            <div className="page active listing-page" style={{ paddingTop: '70px' }}>
                <div className="container listing-container">
                     <div className="listing-content">
                        <div className="listing-images">
                            <div className="thumbnail-images"><img src={product.image} alt={`${product.title} Thumbnail`} className="thumbnail-img" onClick={() => setSelectedImage(product.image)} /></div>
                            <img src={selectedImage} alt={product.title} className="main-image" />
                        </div>
                        <div className="listing-details">
                            <h1 className="listing-title">{product.fullTitle || product.title}</h1>
                            <div className="listing-price">
                                ₱{rentalPriceDetails.total.toFixed(2)} for {rentalOptions.days} day(s)
                                {parseInt(rentalOptions.days) > 1 && <span> (₱{rentalPriceDetails.perDay.toFixed(2)}/day)</span>}
                            </div>
                            <div className="listing-meta">
                                {currentUser && (currentUser.id === product.ownerId || currentUser.role === 'admin') && (
                                    <div className="meta-item"><i className="fas fa-tag"></i> Tracking ID: <span className="listing-tracking-id">{product.trackingTagId || 'N/A'}</span></div>
                                )}
                                <div className="meta-item"><i className="fas fa-user"></i> Owner: <span className="listing-owner-name">{product.ownerName || 'N/A'}</span></div>
                            </div>
                            <div className="listing-description"><p>{product.description}</p></div>
                            <div className="rental-options">
                                <div className="option-group"><label htmlFor="rentalDays">Rental Duration</label>
                                    <select id="rentalDays" name="days" value={rentalOptions.days} onChange={handleOptionChange}>
                                        <option value="1">1 day - ₱{(product.price).toFixed(2)}</option>
                                        <option value="3">3 days - ₱{(product.price * 2.5).toFixed(2)}</option>
                                        <option value="7">7 days - ₱{(product.price * 5).toFixed(2)}</option>
                                    </select>
                                </div>
                                <div className="option-group"><label htmlFor="deliveryOption">Delivery Option</label>
                                    <select id="deliveryOption" name="deliveryFee" value={rentalOptions.deliveryFee} onChange={handleOptionChange}>
                                        <option value="0">Pickup - Free</option>
                                        <option value="15">Delivery - ₱15</option>
                                    </select>
                                </div>
                                <div className="option-group"><label htmlFor="rentalDate">Rental Start Date</label>
                                    <input type="date" id="rentalDate" name="startDate" min={getTodayString()} value={rentalOptions.startDate} onChange={handleOptionChange} />
                                </div>
                            </div>
                            {currentUser && currentUser.role === 'renter' && (
                                <button className="btn btn-primary btn-block" onClick={handleAddToCart}><i className="fas fa-cart-plus"></i> Add to Cart</button>
                            )}
                            {currentUser && currentUser.id !== product.ownerId && (
                                <button className="btn btn-outline btn-block listing-chat-owner-btn" onClick={handleChatWithOwner}><i className="fas fa-comments"></i> Chat with Owner</button>
                            )}
                        </div>
                    </div>
                    <div className="reviews-section" id={`reviews-section-${product.id}`}>
                        <h3>Customer Reviews</h3>
                        {product.reviews && product.reviews.length > 0 ? (<p>Reviews would be displayed here.</p>) : (<p>No reviews yet for this listing.</p>)}
                        {currentUser && currentUser.role === 'renter' && (<button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={() => setReviewModalOpen(true)}>Leave a Review</button>)}
                    </div>
                </div>
            </div>
            {isReviewModalOpen && <ReviewModal productId={product.id} productTitle={product.title} closeModal={() => setReviewModalOpen(false)} />}
        </>
    );
};

export default ListingDetailPage;
