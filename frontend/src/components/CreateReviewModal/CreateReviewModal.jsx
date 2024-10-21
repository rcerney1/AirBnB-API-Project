import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/spots';
import './ReviewForm.css';

function ReviewForm({ spotId, user, hasReviewed, isOwner }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [comment, setComment] = useState("");
    const [stars, setStars] = useState(0);
    const [hoveredStars, setHoveredStars] = useState(0);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        setComment("");
        setStars(0);
        setHoveredStars(0);
        setServerError(null);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        const reviewData = {
            review: comment,
            stars,
            spotId,
        };

        try {
            await dispatch(createReview(reviewData));
            closeModal();
        } catch (error) {
            setServerError('An error occurred while submitting your review. Please try again.');
        }
    };

    const isSubmitDisabled = comment.length < 10 || stars === 0;

    if (isOwner || hasReviewed || !user) return null;

    return (
        <div data-testid='review-modal' className="review-modal-container">
            <h2>How was your stay?</h2>
            <form onSubmit={handleSubmit}>
                {serverError && <p className="error">{serverError}</p>}
                
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave your review here..."
                    required
                />

                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onMouseEnter={() => setHoveredStars(star)}
                            onMouseLeave={() => setHoveredStars(0)}
                            onClick={() => setStars(star)}
                            className={star <= (hoveredStars || stars) ? 'filled' : 'empty'}
                            data-testid='review-star-clickable'
                        >
                            ★
                        </span>
                    ))}
                </div>

                <button type="submit" disabled={isSubmitDisabled}>Submit Your Review</button>
            </form>
        </div>
    );
}

export default ReviewForm;
