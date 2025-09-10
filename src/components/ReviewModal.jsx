import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            hidden
                        />
                        <i
                            className={`fas fa-star star ${ratingValue <= (hover || rating) ? 'active' : ''}`}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                        ></i>
                    </label>
                );
            })}
        </div>
    );
};

const ReviewModal = ({ productId, productTitle, closeModal }) => {
    const { currentUser, showToast } = useApp();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !reviewText) {
            showToast("Please provide a rating and a review text.");
            return;
        }

        console.log({
            productId,
            rating,
            reviewText,
            user: currentUser.email,
        });

        showToast("Thank you for your review!");
        closeModal();
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Leave a Review for {productTitle}</h2>
                    <button className="modal-close-btn" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                    <form id="reviewForm" onSubmit={handleSubmit}>
                        <div className="form-group star-rating-container">
                            <label>Your Rating*</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reviewerName">Your Name*</label>
                            <input
                                type="text"
                                id="reviewerName"
                                value={currentUser.name || ''}
                                readOnly
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reviewText">Your Review*</label>
                            <textarea
                                id="reviewText"
                                rows="5"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Submit Review</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
