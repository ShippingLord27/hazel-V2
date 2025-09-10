import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const CartPage = () => {
    const { cart, products, removeFromCart, currentUser } = useApp();
    const navigate = useNavigate();
    
    if (!currentUser) {
        return (
             <div className="page active" style={{ paddingTop: '70px', textAlign: 'center' }}>
                 <div className="container">
                     <h1>Please Login</h1>
                     <p>You need to be logged in to view your cart.</p>
                 </div>
             </div>
        );
    }
    
    const subtotal = cart.reduce((sum, item) => sum + item.rentalTotalCost, 0);
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;

    return (
        <div className="page active" id="cart-page" style={{ paddingTop: '70px' }}>
            <div className="container cart-page-container">
                <section className="checkout-header-section">
                    <h1>Your Shopping Cart</h1>
                    <p>Review the items you've selected for rental.</p>
                </section>
                {cart.length === 0 ? (
                    <p className="cart-empty-message">Your shopping cart is empty.</p>
                ) : (
                    <div className="cart-grid">
                        <div className="cart-items-list">
                            {cart.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                if (!product) return null;
                                return (
                                    <div className="cart-item" key={item.productId}>
                                        <img src={product.image} alt={product.title} className="cart-item-image" />
                                        <div className="cart-item-details">
                                            <h3>{product.fullTitle}</h3>
                                            <p>Duration: {item.rentalDurationDays} day(s)</p>
                                            <p>Start Date: {new Date(item.rentalStartDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="cart-item-price">₱{item.rentalTotalCost.toFixed(2)}</div>
                                        <button className="cart-item-remove-btn" onClick={() => removeFromCart(item.productId)}>&times;</button>
                                    </div>
                                );
                            })}
                        </div>
                        <aside className="cart-summary">
                            <h2>Summary</h2>
                            <div className="price-row">
                                <span>Subtotal:</span>
                                <span id="cartSubtotal">₱{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="price-row">
                                <span>Service Fee (5%):</span>
                                <span id="cartServiceFee">₱{serviceFee.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="price-row total-row">
                                <span>Total:</span>
                                <span id="cartTotal">₱{total.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
