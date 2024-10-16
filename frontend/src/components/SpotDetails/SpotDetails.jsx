import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, fetchSpotReviews } from '../../store/spots';
import './SpotDetails.css'

const SpotDetails = ({ spotId }) => {
    const dispatch = useDispatch();
    const spotDetails = useSelector((state) => state.spots.spotDetails);
    const spotReviews = useSelector((state) => state.spots.spotReviews); 

    console.log("reviews: ",spotReviews)

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId));
    }, [dispatch, spotId]);


    if (!spotDetails) return <p>Loading...</p>;
    
    const preview =  spotDetails.SpotImages[0].url;
    const reviewsCount = Array.isArray(spotReviews) ? spotReviews.length : 0;
    const imagesToDisplay = spotDetails.SpotImages.slice(1, 5);

    

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
                        <p className='call-out-box-star-rating'>⭐ {spotDetails.avgStarRating} · {reviewsCount} reviews</p>
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
                {spotReviews.slice().reverse().map((review) => {
                    const reviewDate = new Date(review.createdAt);
                    const options = { year: 'numeric', month: 'long' };
                    const formattedDate = reviewDate.toLocaleDateString('en-US', options);

                    return (
                        <div className="review-item" key={review.id}>
                            <p className="review-author">{review.User.firstName}</p>
                            <p className="review-date">{formattedDate}</p>
                            <p className="review-text">{review.review}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default SpotDetails;
