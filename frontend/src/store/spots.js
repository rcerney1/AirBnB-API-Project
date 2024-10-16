import { csrfFetch } from './csrf';

// Action Types
const SET_SPOTS = "spots/setSpots";
const SET_SPOT_DETAILS = "spots/setSpotDetails";
const SET_SPOT_REVIEWS = "spots/setSpotReviews";

// Action Creators
const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

const setSpotDetails = (spotDetails) => ({
  type: SET_SPOT_DETAILS,
  payload: spotDetails,
});

const setSpotReviews = (spotReviews) => ({
  type: SET_SPOT_REVIEWS,
  payload: spotReviews,
});


// Thunk to fetch all spots
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots)); 
  }
};

// Thunk to fetch details of a specific spot
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotDetails(data));
  }
};

// Thunk to fetch reviews for a specific spot
export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotReviews(data.Reviews));
  }
};

// Initial state
const initialState = { allSpots: [], spotDetails: null };

// Spots reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, allSpots: action.payload };
    case SET_SPOT_DETAILS:
      return { ...state, spotDetails: action.payload };
    case SET_SPOT_REVIEWS: // Handle the new action type
      return { ...state, spotReviews: action.payload };
    default:
      return state;
  }
};

export default spotsReducer;
