import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpots } from '../../store/spots';
import SpotTile from "../SpotTiles/SpotTile";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './ManageSpotsPage.css'

function ManageSpotsPage() {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.allSpots);
    const [localSpots, setLocalSpots] = useState([]);

    useEffect(() => {
        dispatch(fetchUserSpots());
    }, [dispatch]);

    useEffect(() => {
        setLocalSpots(spots); 
    }, [spots]);

    const handleSpotDeleted = (deletedSpotId) => {
        setLocalSpots(prevSpots => prevSpots.filter(spot => spot.id !== deletedSpotId));
    };

    return (
        <div className="manage-spots-page">
            <h1 className='manage-spots-title'>Manage Spots</h1>
            {localSpots.length > 0 ? ( 
            <div data-testid='user-spots'className="spot-tiles-list">
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
                    <button className='manage-spot-button'>
                    <Link to="/spots/new" className="create-new-spot-link">
                        Create a New Spot
                    </Link>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ManageSpotsPage;
