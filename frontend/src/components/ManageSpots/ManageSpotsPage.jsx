import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpots } from '../../store/spots';
import SpotTile from "../SpotTiles/SpotTile";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function ManageSpotsPage() {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.allSpots);
    const [localSpots, setLocalSpots] = useState([]);

    useEffect(() => {
        dispatch(fetchUserSpots());
    }, [dispatch]);

    useEffect(() => {
        setLocalSpots(spots); // Update local state with fetched spots
    }, [spots]);

    const handleSpotDeleted = (deletedSpotId) => {
        setLocalSpots(prevSpots => prevSpots.filter(spot => spot.id !== deletedSpotId));
    };

    return (
        <div className="manage-spots-page">
            <h1>Manage Spots</h1>
            {localSpots.length > 0 ? ( // Use localSpots instead of spots
                <div className="spot-tiles-list">
                    {localSpots.map((spot) => (
                        <SpotTile
                            key={spot.id}
                            spot={spot}
                            showActions={true}
                            onSpotDeleted={handleSpotDeleted} // Pass callback to SpotTile
                        />
                    ))}
                </div>
            ) : (
                <div className="no-spots-message">
                    <p>You have not posted any spots yet.</p>
                    <NavLink to="/spots/new" className="create-new-spot-link">
                        Create a New Spot
                    </NavLink>
                </div>
            )}
        </div>
    );
}

export default ManageSpotsPage;
