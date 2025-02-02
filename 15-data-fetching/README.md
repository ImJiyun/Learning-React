## Sending HTTP requests

### How NOT to send an HTTP request

- `fetch`
  - offered by the browser, not the React
  - is used to send an HTTP request to some other server
  - wants URL
  - returns Promise that will be resolved to another value (Promise is a wrapper object around a value that's not there yet but will eventually be there)
  - Promise is a standard JS object that will yield different values depending on the state of that promise
  - To access different values, we can chain methods on the result of calling fetch
- `async` / `await` isn't allowed with the component function
- HOWEVER, code like the one below will create an infinite loop

```jsx
import { useState } from "react";
import Places from "./Places.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // it takes time to fetch the data from the backend
  // if the data is not available initially, we must render the component without the data
  // and then update it once data is available

  fetch("http://localhost:3000/places")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setAvailablePlaces(resData.places);
    });

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
```

- every time the component function executes and therefore a new request would be sent whenever the function executes
- in the second then block we update the state, which causes a new execution.

### Sending requests with `useEffect`

```jsx
import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // this effect function will only execute once
  useEffect(() => {
    fetch("http://localhost:3000/places")
      .then((response) => {
        return response.json();
      })
      .then((resData) => {
        setAvailablePlaces(resData.places);
      });
  }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
```

### Using `async` & `await`

To improve the code above, we can replace `then` with `async`, and `await`

```jsx
useEffect(() => {
  async function fetchPlaces() {
    const response = await fetch("http://localhost:3000/places");
    const resData = await response.json();
    setAvailablePlaces(resData.places);
  }

  // make sure the function executed
  fetchPlaces();
}, []);
```

- We can not use useEffect with `async` keyword, so we need to create a function that sends a request (in this case, `fetchPlaces`)

### Handling loading states

- It takes some time to get a response from backend, so it will be a great experience for user to have a loading text
- It's a common that devs manage a loading state

```jsx
import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // this effect function will only execute once
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      const response = await fetch("http://localhost:3000/places");
      const resData = await response.json();
      setAvailablePlaces(resData.places);
      setIsFetching(false);
    }

    // make sure the function executed
    fetchPlaces();
  }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
```

- Between `setIsFetching(true);` and `setIsFetching(false);`, it takes some time.

```jsx
export default function Places({
  title,
  places,
  fallbackText,
  onSelectPlace,
  isLoading,
  loadingText,
}) {
  console.log(places);
  return (
    <section className="places-category">
      <h2>{title}</h2>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && places.length === 0 && (
        <p className="fallback-text">{fallbackText}</p>
      )}
      {!isLoading && places.length > 0 && (
        <ul className="places">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <button onClick={() => onSelectPlace(place)}>
                <img
                  src={`http://localhost:3000/${place.image.src}`}
                  alt={place.image.alt}
                />
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

### Handling HTTP errors

#### Senario 1 : Failing in sending request in the first place

- The network connection crashes

#### Senario 2 : Backend sends back an error code

```jsx
import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  // loading state
  const [isFetching, setIsFetching] = useState(false);
  // data state
  const [availablePlaces, setAvailablePlaces] = useState([]);
  // error state
  const [error, setError] = useState();

  // it takes time to fetch the data from the backend
  // if the data is not available initially, we must render the component without the data
  // and then update it once data is available

  // this effect function will only execute once
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places"); // error can happen here (senario 1)
        const resData = await response.json();

        // ok : a success response
        if (!response.ok) {
          // senario 2
          throw new Error("Failed to fetch places");
        }
        setAvailablePlaces(resData.places);
      } catch (error) {
        // update the UI and show error message
        setError({
          message:
            error.message || "Could not fetch places, please try again later",
        });
      }
      setIsFetching(false); // it should be out of try/catch block
    }

    // make sure the function executed
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
```

- To avoid crashing the app, we use `try` / `catch`
  - when we send a request using `fetch`, the error could happen (senario 1)
  - Or the backend can send error response `!response.ok` (senario 2)
- In catch block, we can manually set error message
- If error occured, we should show the user the error page

```jsx
export default function Error({ title, message, onConfirm }) {
  return (
    <div className="error">
      <h2>{title}</h2>
      <p>{message}</p>
      {onConfirm && (
        <div id="confirmation-actions">
          <button onClick={onConfirm} className="button">
            Okay
          </button>
        </div>
      )}
    </div>
  );
}
```

### Transforming the fetched data

- Now we want to sort the places by the current location of the user
- We can transform the data before setting the data state

```jsx
useEffect(() => {
  async function fetchPlaces() {
    setIsFetching(true);

    try {
      const response = await fetch("http://localhost:3000/places");
      const resData = await response.json();

      // ok : a success response
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          resData.places,
          position.coords.latitude,
          position.coords.longitude
        );
        setAvailablePlaces(sortedPlaces);
        setIsFetching(false);
      });
    } catch (error) {
      // update the UI and show error message
      setError({
        message:
          error.message || "Could not fetch places, please try again later",
      });
      setIsFetching(false);
    }
  }

  // make sure the function executed
  fetchPlaces();
}, []);
```

- `navigator.geolocation.getCurrentPosition` is geolocation API that allows web applications to retrieve the user's current geographical position.
- To get the current location takes time, so we need to move `setIsFetching` right after `getCurrentPosition`

### Extracting code & improving code structure

For reusability, we can outsource the fetching data logic

#### `http.js`

```javascript
export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();

  // ok : a success response
  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }

  return resData.places;
}
```

#### `AvailablePlaces.jsx`

```jsx
useEffect(() => {
  async function fetchPlaces() {
    setIsFetching(true);

    try {
      const places = await fetchAvailablePlaces(); // every function with async will yield a promise

      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          places,
          position.coords.latitude,
          position.coords.longitude
        );
        setAvailablePlaces(sortedPlaces);
        setIsFetching(false);
      });
    } catch (error) {
      // update the UI and show error message
      setError({
        message:
          error.message || "Could not fetch places, please try again later",
      });
      setIsFetching(false);
    }
  }

  // make sure the function executed
  fetchPlaces();
}, []);
```

### Sending data with POST requests

#### `http.js`

```javascript
export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({places}),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to update user data");
  }

  return resData.message;
}
```

- To send a POST request, we must set a configuration object
- Inside of that, we can set the `method`, `body`, `headers` property
- the data of `body` property must be in a format attachable, should be converted to JSON format (arrays are not attachable) -> we can convert it with `JSON.stringify`
- `headers` property : extra metadata attached to the request
  - `"Content-Type": "application/json"` : tell the backend the data will be in JSON format

#### `App.jsx`

```jsx
const [userPlaces, setUserPlaces] = useState([]);

async function handleSelectPlace(selectedPlace) {
  setUserPlaces((prevPickedPlaces) => {
    if (!prevPickedPlaces) {
      prevPickedPlaces = [];
    }
    if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
      return prevPickedPlaces;
    }
    return [selectedPlace, ...prevPickedPlaces];
  });

  try {
    await updateUserPlaces([selectedPlace, ...userPlaces]); // NOT use userPlaces
  } catch (error) {}
}
```

- We might use `userPlaces` state, but the state update will NOT available in the next line
- It will only be available after the component function executes the next time
- Instead, we should extract the old `userPlaces` state and add the newly `selectedPlace` (`[selectedPlace, ...userPlaces]`)

### Using optimitsic updating

- update the state before sending the request
- So we don't have to have loading state
- It can provide better user experience than showing the loading spinner
  - when sending the request before the state, the user might feel the app struck

#### `App.jsx`

```jsx
const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

async function handleSelectPlace(selectedPlace) {
  // optimistic updating
  setUserPlaces((prevPickedPlaces) => {
    if (!prevPickedPlaces) {
      prevPickedPlaces = [];
    }
    if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
      return prevPickedPlaces;
    }
    return [selectedPlace, ...prevPickedPlaces];
  });

  try {
    await updateUserPlaces([selectedPlace, ...userPlaces]);
  } catch (error) {
    setUserPlaces(userPlaces); // roll back with the old state
    setErrorUpdatingPlaces({
      message: error.message || "Failed to update places.",
    });
  }
}
```

- when an error occurred, we should set the state with the old one
- And need to inform the user that sending the POST request failed
- So we need another state (`errorUpdatingPlaces`)

```jsx
import { useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updateUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      // sending the request might fail
      setUserPlaces(userPlaces); // reset the state with the old one
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places.",
      });
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    setModalIsOpen(false);
  }, []);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      {/* when updating request failed */}
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
```

### Sending DELETE request

```jsx
const handleRemovePlace = useCallback(
  async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updateUserPlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      );
    } catch (error) {
      setUserPlaces(userPlaces); // roll back the change
      setErrorUpdatingPlaces({
        message: error.message || "Failed to delete place.",
      });
    }
    setModalIsOpen(false);
  },
  [userPlaces]
);
```
