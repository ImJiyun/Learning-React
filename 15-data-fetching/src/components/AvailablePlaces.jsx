import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import ErrorPage from './Error.jsx';

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
        // fetch function itself throws an error if the request fails
        // so it need to be wrapped in try-catch block
        const respone = await fetch("http://localhost:3000/placesee");
        const resData = await respone.json();

        // handling errors
        if (!respone.ok) { // 400, 500 status codes
          throw new Error(resData.message || "Failed to fetch places.");
          // throwing error will stop the execution of the function
        }
        setAvailablePlaces(resData.places);
      } catch (error) {
        setError({message: error.message || "Could not fetch places, please try again later"});
      }
      // even if an error occurs, we still want to set isFetching to false
      setIsFetching(false);

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
