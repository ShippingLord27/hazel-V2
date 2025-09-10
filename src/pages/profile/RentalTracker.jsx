import React from 'react';
import { useApp } from '../../hooks/useApp';

const RentalItem = ({ rental, product, isOwnerView, onStatusUpdate, onPrint }) => (
    <div className="rental-tracker-item">
        <img src={product.image} alt={product.title} />
        <div className="rental-tracker-info">
            <h4>{product.title}</h4>
            {isOwnerView ? (
                <p>Rented by: {rental.renterName}</p>
            ) : (
                <p>Owner: {product.ownerName}</p>
            )}
            <p>Start Date: {new Date(rental.rentalStartDate).toLocaleDateString()}</p>
            <p>Status: <span className={rental.status === 'Active' ? 'status-active' : 'status-rented'}>{rental.status}</span></p>
        </div>
        <div className="rental-tracker-actions">
            {isOwnerView && rental.status === 'Active' && (
                <button 
                    className="btn btn-success btn-small"
                    onClick={() => onStatusUpdate(rental.transactionId, 'Completed')}
                >
                    Mark as Returned
                </button>
            )}
            {!isOwnerView && (
                <button className="btn btn-outline btn-small" onClick={() => onPrint(rental)}>
                    <i className="fas fa-print"></i> Print Receipt
                </button>
            )}
        </div>
    </div>
);

const RentalTracker = () => {
    const { currentUser, products, rentalHistory, ownerLentHistory, generateAndPrintReceipt, updateRentalStatus } = useApp();

    if (!currentUser) {
        return (
             <div className="profile-view">
                <div className="profile-view-header"><h1>Rental Tracker</h1></div>
                <p>Loading rental history...</p>
            </div>
        );
    }
    
    const handlePrintReceipt = (rental) => {
        const orderDetails = {
            transactionId: rental.transactionId, date: rental.rentalStartDate,
            items: [{ productId: rental.productId, rentalDurationDays: rental.rentalDurationDays, rentalTotalCost: rental.rentalTotalCost }],
            rentalCost: rental.rentalTotalCost, deliveryFee: rental.deliveryFee,
            serviceFee: rental.serviceFee, totalAmount: rental.totalAmount
        };
        generateAndPrintReceipt(orderDetails);
    };

    const history = currentUser.role === 'owner' ? ownerLentHistory : rentalHistory;
    const activeRentals = history.filter(r => r.status === 'Active');
    const completedRentals = history.filter(r => r.status === 'Completed');


    return (
        <div className="profile-view">
            <div className="profile-view-header">
                <h1>Rental Tracker</h1>
                <p>
                    {currentUser.role === 'owner' 
                        ? "Track items you've lent out."
                        : "Track items you've rented."
                    }
                </p>
            </div>
            <div id="rentalTrackerGrid">
                <h3>Active Rentals</h3>
                {activeRentals.length > 0 ? (
                    activeRentals.map(rental => {
                        const product = products.find(p => p.id === rental.productId);
                        if (!product) return null;
                        return <RentalItem 
                                    key={rental.transactionId} 
                                    rental={rental} 
                                    product={product} 
                                    isOwnerView={currentUser.role === 'owner'}
                                    onStatusUpdate={updateRentalStatus}
                                    onPrint={handlePrintReceipt}
                                />;
                    })
                ) : (
                    <p>You have no active rentals.</p>
                )}

                <h3>Completed Rentals</h3>
                {completedRentals.length > 0 ? (
                    completedRentals.map(rental => {
                        const product = products.find(p => p.id === rental.productId);
                        if (!product) return null;
                        return <RentalItem 
                                    key={rental.transactionId}
                                    rental={rental}
                                    product={product}
                                    isOwnerView={currentUser.role === 'owner'}
                                    onPrint={handlePrintReceipt}
                                />;
                    })
                ) : (
                    <p>You have no completed rentals.</p>
                )}
            </div>
        </div>
    );
};

export default RentalTracker;
