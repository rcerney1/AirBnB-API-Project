import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, fetchSpotReviews, clearSpotDetails, clearSpotReviews, deleteReview } from '../../store/spots';
import { useModal } from '../../context/Modal';
import DeleteReviewConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import ReviewForm from '../CreateReviewModal/CreateReviewModal';
import './SpotDetails.css';

const SpotDetails = ({ spotId, user }) => {
    const dispatch = useDispatch();
    const spotDetails = useSelector((state) => state.spots.spotDetails);
    const spotReviews = useSelector((state) => state.spots.spotReviews);
    console.log

    const { setModalContent } = useModal(); // Get modal functions from context

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
        return () => {
            dispatch(clearSpotDetails()); // Cleanup on unmount
        };
    }, [dispatch, spotId, spotReviews]);

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId));
        return () => {
            dispatch(clearSpotReviews()); // Cleanup on unmount
        };
    }, [dispatch, spotId]);

    //conditional that makes sure all appropriate data is available before rendering
    if (!spotDetails || !spotReviews || !spotDetails.Owner ) return <p>Loading spot details...</p>;

    // Fallback for missing spot images
    const preview = spotDetails.SpotImages && spotDetails.SpotImages.length > 0 
        ? spotDetails.SpotImages[0].url 
        : 'https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg'; // Default image URL

    const reviewsCount = Array.isArray(spotReviews) ? spotReviews.length : 0;

    // Determine the rating to display
    const displayRating = spotDetails.avgStarRating ? spotDetails.avgStarRating : 'New';
    const imagesToDisplay = spotDetails.SpotImages ? spotDetails.SpotImages.slice(1, 5) : [];

   
    //check to see if the user has reviewed or owns the spot
    const hasReviewed = user ? spotReviews.some(review => review.userId === user.id) : null;
    const isOwner = user ?  spotDetails.Owner.id === user.id : null;

    //check user eligibility to post a review
    const canPostReview = user && !isOwner && !hasReviewed;
     


    // Function to open the modal with ReviewForm
    const openReviewFormModal = () => {
        setModalContent(
            <ReviewForm 
                spotId={spotId} 
                user={user} 
                hasReviewed={hasReviewed} 
                isOwner={isOwner}
                onSubmit={() => {
                    dispatch(fetchSpotReviews(spotId)); // Re-fetch the reviews after submission
                }}
            />
        );
    };
    

    // Function to open the modal with DeleteReviewConfirmation
    const openDeleteReviewModal = (reviewId) => {
        console.log("hi")
        setModalContent(
          <DeleteReviewConfirmationModal
            reviewId={reviewId}
            onReviewDeleted={() => dispatch(deleteReview(reviewId))}
          />
        );
    };

    return (
        <div className="spot-details-container">
            {/* Spot Name and Location */}
            <div className="spot-header">
                <h1 className="spot-title">{spotDetails.name}</h1>
                <p className="spot-location">{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>
            </div>

            {/* Image Gallery */}
            <div className="image-gallery">
                <div className="large-image">
                    <img src={preview} alt="Preview" />
                </div>
                <div className="small-images">
                    {imagesToDisplay.map((image, index) => (
                        <img key={index} src={image.url} alt={`Thumbnail ${index}`} />
                    ))}
                </div>
            </div>

            {/* Host and Description */}
            <div className="host-description">
                <p className="host-name">Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</p>
                <p className="spot-description">{spotDetails.description}</p>
            </div>

            {/* Call-out Box */}
            <div className="call-out-box">
                <div className="call-out-info">
                    <p className="price-info">${spotDetails.price} <span>night</span></p>
                    <div className="call-out-reviews">
                        <p className="call-out-box-star-rating">⭐ {displayRating} · {reviewsCount} reviews</p>
                    </div>
                </div>
                <button className="reserve-button" onClick={() => alert('Feature coming soon')}>
                    Reserve
                </button>
            </div>



            {/* Reviews Section */}
            <div className="reviews-section">
                <h2 className="review-header">
                    ⭐ {spotDetails.avgStarRating} · {reviewsCount} reviews
                </h2>
                {/* Post Review Button */}
                <div className='post-review-button-container'>
                {canPostReview && (
                    <button className="review-button" onClick={openReviewFormModal}>
                        Post Your Review
                    </button>
                )}
                </div>
                {spotReviews.length > 0 ? (
                    spotReviews.slice().reverse().map((review) => {
                        const reviewDate = new Date(review.createdAt);
                        const options = { year: 'numeric', month: 'long' };
                        const formattedDate = reviewDate.toLocaleDateString('en-US', options);

                        return (
                            <div className="review-item" key={review.id}>
                                <p className="review-author">{review.User ? review.User.firstName : user.firstName}</p>
                                <p className="review-date">{formattedDate}</p>
                                <p className="review-text">{review.review}</p>

                                {user && user.id === review.userId && (
                                    <button
                                        className="delete-review-button"
                                        onClick={() => openDeleteReviewModal(review.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>Be the first to post a review!</p>
                )}
            </div>
        </div>
    );
};

export default SpotDetails;
