import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpotTile.css';

const SpotTile = ({ spot, showActions }) => {
  const navigate = useNavigate();

  // Function to handle clicking the tile to navigate to the spot's detail page
  const handleTileClick = () => {
    navigate(`/spots/${spot.id}`);
  };

  // Function to handle the update button click
  const handleUpdateClick = (e) => {
    e.stopPropagation(); 
    navigate(`/spots/${spot.id}/edit`);
  };

  // Function to handle the delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevents navigating to the spot's details

    //! Dispatch the delete thunk here (to be added in `spots.js`)

    console.log(`Delete spot with id: ${spot.id}`);
  };

  // Determine the rating to display
  const displayRating = spot.avgRating ? spot.avgRating : 'New';

  return (
    <div className="spot-tile" onClick={handleTileClick} title={spot.name}>
      <img src={spot.previewImage} alt={`${spot.name}`} className="spot-thumbnail" />
      <div className="spot-details">
        <div className="details-row">
          <div className="location">{spot.city}, {spot.state}</div>
          <div className="rating">⭐ {displayRating} </div>
        </div>
        <div className="details-row">
          <div className="price">${spot.price} / night</div>
        </div>
        
        {/* Conditionally render Update/Delete buttons */}
        {showActions && (
          <div className="actions-row">
            <button className="update-button" onClick={handleUpdateClick}>Update</button>
            <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotTile;
