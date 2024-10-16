import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpotTile.css';



const SpotTile = ({ spot }) => {
  const navigate= useNavigate();

  // Function to handle clicking the tile to navigate to the spot's detail page
  const handleTileClick = () => {
    navigate(`/spots/${spot.id}`);
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
      </div>
    </div>
  );
};

export default SpotTile;
