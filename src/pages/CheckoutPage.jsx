import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const CheckoutPage = () => {
    const { cart, currentUser, products, clearCart, showToast, rentalAgreementTemplate, generateAndPrintReceipt, addRentalRecord } = useApp();
    const navigate = useNavigate();
    
    const [agreed, setAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });

    useEffect(() => {
        if (!currentUser || cart.length === 0) { if (!isConfirmed) { showToast("Your cart is empty or you are not logged in."); navigate('/products'); } }
        else if (currentUser.payment_info) { setPaymentDetails({ cardNumber: currentUser.payment_info.cardNumber || '', expiryDate: currentUser.payment_info.expiryDate || '', cvv: currentUser.payment_info.cvv || '', }); }
    }, [currentUser, cart, navigate, showToast, isConfirmed]);

    const rentalCost = useMemo(() => cart.reduce((sum, item) => sum + item.rentalTotalCost, 0), [cart]);
    const deliveryFee = useMemo(() => cart.reduce((sum, item) => sum + item.deliveryFee, 0), [cart]);
    const serviceFee = useMemo(() => rentalCost * 0.05, [rentalCost]);
    const totalAmount = useMemo(() => rentalCost + deliveryFee + serviceFee, [rentalCost, deliveryFee, serviceFee]);
    
    const agreementContent = useMemo(() => {
        const renterName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "The Renter";
        const itemsList = cart.map(item => { const product = products.find(p => p.id === item.productId); return `<li><b>${product?.title || 'Unknown Item'}</b> (owned by ${product?.ownerName || 'Owner'}) - ${item.rentalDurationDays} day(s) starting ${new Date(item.rentalStartDate).toLocaleDateString()}. ${product?.ownerTerms || ''}</li>`; }).join('');
        return rentalAgreementTemplate.replace(/\[Renter Name\]/g, renterName).replace(/\[List of Items and Terms\]/g, `<ul>${itemsList}</ul>`);
    }, [cart, products, rentalAgreementTemplate, currentUser]);

    const handlePaymentChange = (e) => { setPaymentDetails({ ...paymentDetails, [e.target.id.replace('checkout', '')]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        showToast("Processing payment...");

        const orderDetails = {
            transactionId: `HZL-TRX-${Date.now()}`,
            date: new Date().toISOString(),
            items: [...cart],
            rentalCost,
            deliveryFee,
            serviceFee,
            totalAmount,
        };
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        await addRentalRecord(orderDetails);

        setCompletedOrder(orderDetails);
        setIsProcessing(false);
        setIsConfirmed(true);
        showToast("Rental Confirmed! Thank you.");
        clearCart();
    };
    
    return (
        <div className="page active" id="checkout-page" style={{ paddingTop: '70px' }}>
            <div className="container checkout-page-container">
                <section className="checkout-header-section">
                    <h1>{isConfirmed ? 'Rental Confirmed!' : 'Complete Your Rental'}</h1>
                    <p>{isConfirmed ? 'Thank you for your order. A receipt is available for your records.' : 'Please review and agree to the terms before payment.'}</p>
                </section>

                {isConfirmed ? (
                    <div className="checkout-confirmation-section">
                        <i className="fas fa-check-circle"></i>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button className="btn btn-success" onClick={() => generateAndPrintReceipt(completedOrder)}>
                                <i className="fas fa-print"></i> Print Receipt
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/profile/rental-tracker')}>
                                <i className="fas fa-route"></i> View My Rentals
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="checkout-content-grid">
                        <div className="checkout-forms-container">
                            <div id="checkout-agreement-section">
                                <h3>Rental Agreement</h3>
                                <div className="agreement-content" dangerouslySetInnerHTML={{ __html: agreementContent }}></div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="checkbox" id="checkoutAgreementCheckbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                    <label htmlFor="checkoutAgreementCheckbox" style={{ marginBottom: 0 }}>I have read and agree to all terms.</label>
                                </div>
                            </div>
                            <div id="checkout-payment-section" className={!agreed ? 'disabled' : ''}>
                                <form id="checkoutForm" onSubmit={handleSubmit}>
                                    <div className="checkout-section"><h3>Payment Details</h3></div>
                                    <div className="form-group"><label htmlFor="checkoutCardNumber">Card Number</label><input type="text" id="checkoutCardNumber" placeholder="4242 4242 4242 4242" required value={paymentDetails.cardNumber} onChange={handlePaymentChange} /></div>
                                    <div className="form-group-row">
                                        <div className="form-group"><label htmlFor="checkoutExpiryDate">Expiry Date</label><input type="text" id="checkoutExpiryDate" placeholder="MM/YY" required value={paymentDetails.expiryDate} onChange={handlePaymentChange}/></div>
                                        <div className="form-group"><label htmlFor="checkoutCvv">CVV</label><input type="text" id="checkoutCvv" placeholder="123" required value={paymentDetails.cvv} onChange={handlePaymentChange} /></div>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block" disabled={!agreed || isProcessing}>
                                        {isProcessing ? 'Processing...' : `Confirm & Pay ₱${totalAmount.toFixed(2)}`}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <aside className="checkout-order-summary">
                            <h2>Order Summary</h2>
                            <div id="checkoutItemDetails">
                                {cart.map(item => { const product = products.find(p => p.id === item.productId); if (!product) return null; return ( <div className="checkout-summary-item" key={item.productId}><img src={product.image} alt={product.title} /><div className="checkout-summary-item-info"><h4>{product.title}</h4><p>{item.rentalDurationDays} day(s) at ₱{item.rentalTotalCost.toFixed(2)}</p></div></div> ); })}
                            </div>
                            <div className="checkout-price-breakdown">
                                <div className="price-row"><span className="label">Rental Cost:</span> <span>₱{rentalCost.toFixed(2)}</span></div>
                                <div className="price-row"><span className="label">Delivery Fee:</span> <span>₱{deliveryFee.toFixed(2)}</span></div>
                                <div className="price-row"><span className="label">Service Fee (5%):</span> <span>₱{serviceFee.toFixed(2)}</span></div>
                                <hr/>
                                <div className="price-row total"><span className="label">Total:</span> <span>₱{totalAmount.toFixed(2)}</span></div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
