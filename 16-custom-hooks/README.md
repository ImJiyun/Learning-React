## Custom Hooks
### **Rules of Hooks**

1. **Only Call Hooks in React Functions**

   - Hooks must only be used inside React component functions or other custom hooks.
   - Calling hooks outside of these contexts leads to errors because React cannot track their states.

2. **Call Hooks at the Top Level**
   - Hooks should not be placed inside nested blocks like `if`, `for`, or `switch` statements.
   - This ensures that hooks are called in the same order every time the component renders, which is vital for React's hook execution order.

---

### **Why Custom Hooks?**

- Custom hooks allow us to **encapsulate reusable logic** that is not directly tied to returning JSX.
- These are particularly useful when:
  - The logic needs to be shared across multiple components.
  - The logic does not involve rendering but still benefits from React's lifecycle or state management.

---

### **Creating a Custom Hook**

Example: `useFetch`

- **Purpose**: Encapsulate fetching data logic.
- **Structure**:
  - Use `useState` to manage fetching states (`isFetching`, `error`, `data`).
  - Use `useEffect` to trigger fetching logic and ensure side effects are handled properly.
  - Return relevant states for components to consume.

Code:

```javascript
import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch data." });
      }
      setIsFetching(false);
    }
    fetchData();
  }, [fetchFn]);

  return { isFetching, fetchedData, setFetchedData, error };
}
```

---

### **Using Custom Hooks**

1. **Component Logic Integration**:

   - States managed by the hook become part of the component.
   - Changes in the custom hook's states trigger a re-render of the component.

2. **Example in a Component**:

   ```jsx
   import { useFetch } from "./hooks/useFetch";
   import { fetchUserPlaces } from "./http";

   function App() {
     const {
       isFetching,
       fetchedData: userPlaces,
       error,
     } = useFetch(fetchUserPlaces, []);

     return (
       <div>
         {error && <p>{error.message}</p>}
         {isFetching ? <p>Loading...</p> : <Places places={userPlaces} />}
       </div>
     );
   }
   ```

---

### **Advanced Usage Example**

The `AvailablePlaces` component demonstrates:

- A custom hook (`useFetch`) that fetches and sorts places by distance.
- Encapsulation of `navigator.geolocation` logic within a separate function (`fetchSortedPlaces`).

Code:

```javascript
async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      resolve(sortedPlaces);
    });
  });
}
```

Usage in Component:

```jsx
function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
  } = useFetch(fetchSortedPlaces, []);

  if (error) return <Error title="Error" message={error.message} />;

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      onSelectPlace={onSelectPlace}
    />
  );
}
```

---

