import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpots } from '../../store/spots'
import SpotTile from "../SpotTiles/SpotTile";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";


function ManageSpotsPage(){
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.allSpots);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(fetchUserSpots())
    }, [dispatch]);

    console.log("spots, and user: ", spots, user)

    return (
        <div className="manage-spots-page">
          <h1>Manage Spots</h1>
          {spots.length > 0 ? (
            <div className="spot-tiles-list">
              {spots.map((spot) => (
                <SpotTile key={spot.id} spot={spot} showActions={true} />
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