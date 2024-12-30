import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import ErrorPage from './Error.jsx';
import {sortPlacesByDistance} from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  // loading state
  const [isFetching, setIsFetching] = useState(false);
  // TODO: Fetch available places from the server
  // the places data is not available initially (bc we need to send HTTP request), so we use an empty array 
  // data state
  const [availablePlaces, setAvailablePlaces] = useState([]);
  // error state
  const [error, setError] = useState();

  useEffect(() => {
    // dont' use async keyword in front of the function called by React
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        
        const places = await fetchAvailablePlaces();
        // transform the places data
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
          
        });
      } catch (error) {
        setError({message: error.message || "Could not fetch places, please try again later"});
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);
  
  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
